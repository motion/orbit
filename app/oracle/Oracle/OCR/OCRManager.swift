//
//  OCRManager.swift
//  Oracle
//
//  Created by Collin Hundley on 10/8/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation
import CoreImage
import Vision
import CoreML


/// Manages character recognition
class OCRManager {
    
    /// Shared intance.
    static let shared = OCRManager()
    
    /// ML model for performing OCR classification.
    fileprivate let ocrModel = OCRModel()
    
    /// Character array corresponding to NN classification output.
    /// This array MUST match the array used for training the neural net!
    fileprivate let supportedChars = Array("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?;:@[]'\"()-#$*")
    
    /// State variable - used to instruct any running frames to exit early if a new frame arrives.
    /// IMPORTANT: Flags may be READ from any queue, but must only be SET from the main queue.
    fileprivate var frameExitFlags = [OCRExitFlag]()
    
    private init() {}
    
}


/// Wrapper for flag
/// IMPORTANT: We wrap this flag in a class so that it becomes a reference type,
/// and we can track it across threads easily.
fileprivate class OCRExitFlag {
    
    /// Private storage - do NOT access this directly.
    private var cancelFlag = false
    
    var shouldCancel: Bool {
        get {
            // Synchronize access from any queue
            var cancel = false
            DispatchQueue.main.sync {
                cancel = cancelFlag
            }
            return cancel
        }
        set(newValue) {
            cancelFlag = newValue
        }
    }
}


// MARK: Public API

extension OCRManager {
    
    /// Main OCR entry point.
    /// Accepts a raw screen buffer, crops to the given bounds, and extracts any text found.
    /// Results are broadcast via global Websocket connection.
    ///
    /// - Parameters:
    ///   - baseAddress: The raw screen buffer's base address. Buffer must be in YUV format (kCVPixelFormatType_420YpCbCr8BiPlanarFullRange).
    ///   - bytesPerRow: The screen buffer's number of bytes per row.
    ///   - bounds: The bounds of interest, in **PIXEL** coordinates (not points). This will usually be the bounds of a single application window.
    func performOCR(on baseAddress: UnsafeMutableRawPointer, bytesPerRow: Int, bounds: CGRect) {
        // Create exit flag for this frame
        let thisFrameExitFlag = OCRExitFlag()
        
        // Cancel any and all running previous frames
        // Note: Screen buffers are coming here on the main queue.
        // If a different queue is used in the future, access to the flag will need to be synchronized.
        for flag in frameExitFlags {
            flag.shouldCancel = true
        }
        
        // Add this exit flag to the array (so this frame may be cancelled if needed)
        frameExitFlags.append(thisFrameExitFlag)

        // Crop the pixel buffer to the region we're interested in
        // (Usually a single application window)
        guard let croppedBuffer = CVPixelBuffer.cropYUVToGrayscale(to: bounds, baseAddress: baseAddress, bytesPerRow: bytesPerRow) else {
            return Log.error("ERROR: Unable to crop screen pixel buffer to provided bounds: \(bounds)")
        }
        CVPixelBufferLockBaseAddress(croppedBuffer, .readOnly)
        
        // Apply filters to improve OCR performance
        let filteredBuffer = croppedBuffer.filterForOCR()
        
        // Unlock cropped buffer base address (no longer needed)
        CVPixelBufferUnlockBaseAddress(croppedBuffer, .readOnly)
        
        // Lock filtered buffer base address
        CVPixelBufferLockBaseAddress(filteredBuffer, .readOnly)
        guard let filteredBaseAddress = CVPixelBufferGetBaseAddress(filteredBuffer) else {
            return Log.error("ERROR: Unable to determine base address of filtered pixel buffer.")
        }
        let filteredBytesPerRow = CVPixelBufferGetBytesPerRow(filteredBuffer)
        let filteredHeight = CVPixelBufferGetHeight(filteredBuffer)
        
        // Perform text detection on cropped+filtered buffer
        extractTextBoxes(from: filteredBuffer) { [unowned self] (lines) in
            
            /* ----- IMPORTANT: ENTERING BACKGROUND QUEUE HERE ----- */
            
            // Iterate through every character box in each line
            for line in lines {
                for character in line.characters {
                    
                    // Check if this frame's exit flag has been set.
                    // Checking the flag here within the inner loop gives us the highest
                    // granularity, and ability to exit the fastest when a new frame arrives.
                    if thisFrameExitFlag.shouldCancel {
                        // Remove this flag from the array and exit
                        DispatchQueue.main.async {
                            self.frameExitFlags.removeAll(where: {$0 === thisFrameExitFlag})
                        }
                        return
                    }
                    
                    
                    // Attempt to trace character outline
                    let percentDownLine = Float(character.bounds.minY - line.bounds.minY) / Float(line.bounds.height)
                    if let (outline, _) = CharacterCache.shared.traceOutline(baseAddress: filteredBaseAddress,
                                                                             bytesPerRow: filteredBytesPerRow,
                                                                             numRows: filteredHeight,
                                                                             charBounds: character.bounds,
                                                                             lineHeight: Int(line.bounds.height),
                                                                             maxMoves: Int(line.bounds.height * 10),
                                                                             initialMove: [0, CharacterCache.shared.moves.px],
                                                                             findHangers: true,
                                                                             percentDownLine: percentDownLine) {
                        
                        // Check if this char has already been cached
                        if let cachedChar = CharacterCache.shared.cachedCharacter(matching: outline) {
                            // Match! Use this classification
                            character.classification = cachedChar
                        } else {
                            // No matching outline in the cache; perform OCR
                            
                            // Crop pixel buffer down to this character's bounds
                            let charBox = character.lineHeightBounds(with: line.bounds)
                            guard let charBuffer = CVPixelBuffer.cropGrayscale(to: charBox,
                                                                               size: CGSize(width: 28, height: 28),
                                                                               baseAddress: filteredBaseAddress,
                                                                               bytesPerRow: filteredBytesPerRow) else {
                                                                                continue
                            }
                            
                            // Lock new buffer's base address
                            CVPixelBufferLockBaseAddress(charBuffer, .readOnly)
                            
                            // Classify image
                            let classification = self.classifyImage(charBuffer) ?? ""
                            
                            // Store classification
                            character.classification = classification
                            
                            // Add outline to cache
                            CharacterCache.shared.addToCache(outline: outline, character: classification)
                            
                            // Unlock char buffer base address
                            CVPixelBufferUnlockBaseAddress(charBuffer, .readOnly)
                        }
                        
                    } else {
                        // Failed to trace character outline; perform OCR
                        
                        // Crop pixel buffer down to this character's bounds
                        let charBox = character.lineHeightBounds(with: line.bounds)
                        guard let charBuffer = CVPixelBuffer.cropGrayscale(to: charBox,
                                                                           size: CGSize(width: 28, height: 28),
                                                                           baseAddress: filteredBaseAddress,
                                                                           bytesPerRow: filteredBytesPerRow) else {
                                                                            continue
                        }
                        
                        // Lock new buffer's base address
                        CVPixelBufferLockBaseAddress(charBuffer, .readOnly)
                        
                        // Classify image
                        let classification = self.classifyImage(charBuffer) ?? ""
                        
                        // Store classification
                        character.classification = classification
                        
                        // Unlock char buffer base address
                        CVPixelBufferUnlockBaseAddress(charBuffer, .readOnly)
                    }
                }
            }
            
            // Unlock filtered buffer base address
            CVPixelBufferUnlockBaseAddress(filteredBuffer, .readOnly)
            
            // Broadcast results to websocket
            let allWords = lines.map({$0.words()}).reduce([], +)
            Socket.send(.wordsFound(words: allWords))
            
            // DEBUG: print result
            for line in lines {
                print(line.words().map({$0.string}).joined(separator: " "))
            }
            
            // Remove exit flag from array
            DispatchQueue.main.async {
                self.frameExitFlags.removeAll(where: {$0 === thisFrameExitFlag})
            }
        }
    }
    
}


// MARK: Text detection/character extraction

fileprivate extension OCRManager {
    
    
    /// Performs text detection on the provided pixel buffer.
    ///
    /// - Parameters:
    ///   - pixelBuffer: The pixel buffer containing the area of interest.
    ///   - completion: Completion handler.
    func extractTextBoxes(from pixelBuffer: CVPixelBuffer, completion: @escaping (_ lines: [Line]) -> Void) {
        // Compute buffer size
        let bufferSize = CGSize(width: CVPixelBufferGetWidth(pixelBuffer), height: CVPixelBufferGetHeight(pixelBuffer))
        
        // Create a request for detecting text boxes
        let request = VNDetectTextRectanglesRequest { [unowned self] (request, error) in
            // Note: failing silently right now and returning empty result set.
            // There's nothing we can really do if this returns an error; if it
            // happens frequently we probably need to modify our filters.
            if let error = error {
                Log.error("Error extracting characters from image buffer: \(error)")
                completion([])
                return
            }
            
            // Convert results to the right type
            guard let textObservations = request.results as? [VNTextObservation] else {
                // Shouldn't be possible
                Log.error("Error extracting characters from image buffer: couldn't convert result set to VNTextObservation.")
                completion([])
                return
            }
            
            // Make sure we have some results
            guard !textObservations.isEmpty else {
                // No character boxes found
                completion([])
                return
            }
            
            // Get lines
            let lines = self.getLines(from: textObservations, originalSize: bufferSize)
            
            // Return
            completion(lines)
        }
        
        // Make sure request finds individual character boxes
        request.reportCharacterBoxes = true
        
        // Create handler for this image
        let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer)
        
        // Execute request on background queue
        DispatchQueue.global(qos: .userInteractive).async {
            do {
                // Execute request
                try handler.perform([request])
            } catch {
                Log.error("Error performing text detection request: \(error)")
                completion([])
            }
        }
    }
    
    
    /// Extracts all lines and character boxes from an array of `VNTextObservation`s.
    ///
    /// - Parameter textObservations: An array of text observations returned by the request.
    /// - Returns: An array of lines (containg character boxes) as `[Line]`
    private func getLines(from textObservations: [VNTextObservation], originalSize: CGSize) -> [Line] {
        // Vision framework returns bounds normalized to the original image size,
        // with origin at the bottom left corner.
        // Here we convert all boxes back to pixel values, with origin at the top left corner.
        let boundsTransform = CGAffineTransform(scaleX: originalSize.width, y: -originalSize.height)
            .translatedBy(x: 0, y: -1)
        
        // Convert all lines and character boxes to `Line`
        let lines = textObservations.map { (textObservation) -> Line in
            let lineBounds = textObservation.boundingBox.applying(boundsTransform)
            let chars = textObservation.characterBoxes!.map({Character(bounds: $0.boundingBox.applying(boundsTransform))})
            return Line(bounds: lineBounds, characters: chars)
        }
        
        return lines
    }
    
}


// MARK: OCR

fileprivate extension OCRManager {
    
    
    /// Performs OCR on the given pixel buffer, attempting to classify the character contained within the image.
    /// IMPORTANT: This method currently assumes size 28x28 pixel buffer.s
    ///
    /// - Parameters:
    ///   - pixelBuffer: A grayscale pixel buffer containing a single character.
    /// - Returns: The best classification result from the neural net.
    func classifyImage(_ pixelBuffer: CVPixelBuffer) -> String? {
        // Extract raw pixel data from buffer
        let pixelData = CVPixelBufferGetBaseAddress(pixelBuffer)!.assumingMemoryBound(to: UInt8.self)
        
        // Create CoreML-compatible input from pixel data
        let input = try! MLMultiArray(shape: [1, 28, 28], dataType: .float32)
        for row in 0..<28 {
            for col in 0..<28 {
                let index = row * 28 + col
                // Invert and normalize pixels to range [0, 1] where 1 is black
                let pixel: Float = 1.0 - (Float(pixelData[index]) / 255.0)
                input[
                    [NSNumber(integerLiteral: 0),
                     NSNumber(value: row),
                     NSNumber(value: col)]
                    ] = NSNumber(value: pixel)
            }
        }
        
        // Classify image
        guard let prediction = (try? ocrModel.prediction(image: input))?.classification else {
            return nil
        }
        
        // Determine index of maximum probability from output
        let ptr = UnsafeBufferPointer(start: prediction.dataPointer.assumingMemoryBound(to: Float.self), count: supportedChars.count)
        let array = Array(ptr)
        
        guard let maxValue = array.max() else {
            return nil
        }
        
        guard let maxIndex = array.firstIndex(of: maxValue) else {
            return nil
        }
        
        // Determine character matching max index
        let char = supportedChars[maxIndex]
        
        // Return lowercased version of the classification
        return String(char).lowercased()
    }
    
}
