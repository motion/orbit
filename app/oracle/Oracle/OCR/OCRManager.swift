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
    
    /// Counter for debugging purposes.
    fileprivate var classificationCount = 0
    
    
    private init() {
        
    }
    
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
    func performOCR(on baseAddress: UnsafeMutableRawPointer, bytesPerRow: Int, bounds: CGRect, completion: ((_ lines: [Line]) -> Void)? = nil) {
        // Record start time (for performance logging)
        let ocrStartTime = DispatchTime.now()
        
        // Various counters for debugging/performance monitoring
        var totalCacheTime: UInt64 = 0
        var totalMLTime: UInt64 = 0
        var totalCropTime: UInt64 = 0
        var totalCharsCached = 0
        var totalCharsML = 0
        
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
        let filteredBuffer = croppedBuffer.filteredForOCR()
        
        // Debug - log crop+filter time
        let cropFilterEndTime = DispatchTime.now()
        if shouldLogDebug {
            let cropFilterTime = (cropFilterEndTime.uptimeNanoseconds - ocrStartTime.uptimeNanoseconds) / 1_000_000
            Log.debug("FRAME CROPPING/FILTERING TIME: \(cropFilterTime)ms")
        }
        
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
            
            
            // Performance - log character extraction time
            let textDetectionEndTime = DispatchTime.now()
            if shouldLogDebug {
                let elapsed = (textDetectionEndTime.uptimeNanoseconds - cropFilterEndTime.uptimeNanoseconds) / 1_000_000
                Log.debug("TEXT DETECTION TIME: \(elapsed)ms")
            }
            
            // Iterate through every character box in each line
            var charCounter = 0 // For debugging
            for line in lines {
                for character in line.characters {
                    
                    // Check if this frame's exit flag has been set.
                    // Checking the flag here within the inner loop gives us the highest
                    // granularity, and ability to exit the fastest when a new frame arrives.
                    if thisFrameExitFlag.shouldCancel {
                        // Remove this flag from the array and exit
                        DispatchQueue.main.async {
                            // Important: triple equals (===) here to check *instance* equality
                            self.frameExitFlags.removeAll(where: {$0 === thisFrameExitFlag})
                        }
                        
                        // Debug - log exit time
                        if shouldLogDebug {
                            let elapsed = (DispatchTime.now().uptimeNanoseconds - ocrStartTime.uptimeNanoseconds) / 1_000_000
                            Log.debug("Frame cancelled")
                            Log.debug("TOTAL FRAME TIME (cancelled): \(elapsed)ms")
                        }
                        
                        return
                    }
                    
                    
                    // Determine whether this character should be inverted or not
                    // (Invert if light text on dark background)
                    let shouldInvert = filteredBuffer.shouldInvert(bounds: character.lineHeightBounds(with: line.bounds))
                    
                    
                    // Output character box here, if debug image flag is `true`
                    if shouldSaveDebugImages && charCounter < 50 { // Prevent app from saving thousands of images
                        let charBox = character.lineHeightBounds(with: line.bounds)
                        let charBuffer = CVPixelBuffer.cropGrayscale(to: charBox,
                                                                     size: CGSize(width: 28, height: 28),
                                                                     baseAddress: filteredBaseAddress,
                                                                     bytesPerRow: filteredBytesPerRow,
                                                                     inverted: shouldInvert)!
                        OCRTester.shared.save(charBuffer, as: "char-\(charCounter)")
                        charCounter += 1
                    }
                    
                    
                    // Attempt to trace character outline
                    let cacheStartTime = DispatchTime.now()
                    let percentDownLine = Float(character.bounds.minY - line.bounds.minY) / Float(line.bounds.height)
                    if shouldUseCache, let (outline, _) = CharacterCache.shared.traceOutline(baseAddress: filteredBaseAddress,
                                                                             bytesPerRow: filteredBytesPerRow,
                                                                             numRows: filteredHeight,
                                                                             charBounds: character.bounds,
                                                                             shouldInvert: shouldInvert,
                                                                             lineHeight: Int(line.bounds.height),
                                                                             maxMoves: Int(line.bounds.height * 10),
                                                                             initialMove: [0, CharacterCache.shared.moves.px],
                                                                             findHangers: true,
                                                                             percentDownLine: percentDownLine) {

                        // Check if this char has already been cached
                        if let cachedChar = CharacterCache.shared.cachedCharacter(matching: outline) {
                            // Match! Use this classification
                            character.classification = cachedChar
                            
                            // Debug - cache count
                            totalCharsCached += 1
                            
                            // Debug - cache time
                            let cacheEndTime = DispatchTime.now()
                            if shouldLogDebug {
                                totalCacheTime += cacheEndTime.uptimeNanoseconds - cacheStartTime.uptimeNanoseconds
                            }
                            
                        } else {
                            // No matching outline in the cache; perform OCR
                            
                            // Debug - cache time
                            let cacheEndTime = DispatchTime.now()
                            if shouldLogDebug {
                                totalCacheTime += cacheEndTime.uptimeNanoseconds - cacheStartTime.uptimeNanoseconds
                            }

                            // Crop pixel buffer down to this character's bounds
                            let charBox = character.lineHeightBounds(with: line.bounds)
                            guard let charBuffer = CVPixelBuffer.cropGrayscale(to: charBox,
                                                                               size: CGSize(width: 28, height: 28),
                                                                               baseAddress: filteredBaseAddress,
                                                                               bytesPerRow: filteredBytesPerRow,
                                                                               inverted: shouldInvert) else {
                                                                                continue
                            }
                            
                            // Debug
                            let cropEndTime = DispatchTime.now()
                            if shouldLogDebug {
                                let elapsed = cropEndTime.uptimeNanoseconds - cacheEndTime.uptimeNanoseconds
                                totalCropTime += elapsed
                            }

                            // Lock new buffer's base address
                            CVPixelBufferLockBaseAddress(charBuffer, .readOnly)

                            // Classify image
                            let classification = self.classifyImage(charBuffer, isInverted: shouldInvert) ?? ""

                            // Store classification
                            character.classification = classification

                            // Debug - ML count
                            totalCharsML += 1
                            
                            // Debug - ML time
                            if shouldLogDebug {
                                totalMLTime += DispatchTime.now().uptimeNanoseconds - cropEndTime.uptimeNanoseconds
                            }

                            // Add outline to cache
                            CharacterCache.shared.addToCache(outline: outline, character: classification)

                            // Unlock char buffer base address
                            CVPixelBufferUnlockBaseAddress(charBuffer, .readOnly)
                        }

                    } else {
                        // Failed to trace character outline (or cache disabled); perform OCR
                        
                        // Debug
                        let cacheEndTime = DispatchTime.now()
                        if shouldLogDebug {
                            let elapsed = cacheEndTime.uptimeNanoseconds - cacheStartTime.uptimeNanoseconds
                            totalCacheTime += elapsed
                        }
                        
                        // Crop pixel buffer down to this character's bounds
                        let charBox = character.lineHeightBounds(with: line.bounds)
                        guard let charBuffer = CVPixelBuffer.cropGrayscale(to: charBox,
                                                                           size: CGSize(width: 28, height: 28),
                                                                           baseAddress: filteredBaseAddress,
                                                                           bytesPerRow: filteredBytesPerRow,
                                                                           inverted: shouldInvert) else {
                                                                            continue
                        }
                        
                        // Debug
                        let cropEndTime = DispatchTime.now()
                        if shouldLogDebug {
                            let elapsed = cropEndTime.uptimeNanoseconds - cacheEndTime.uptimeNanoseconds
                            totalCropTime += elapsed
                        }
                        
                        // Lock new buffer's base address
                        CVPixelBufferLockBaseAddress(charBuffer, .readOnly)
                        
                        // Classify image
                        let classification = self.classifyImage(charBuffer, isInverted: shouldInvert) ?? ""
                        
                        // Store classification
                        character.classification = classification
                        
                        // Debug - ML count
                        totalCharsML += 1
                        
                        // Debug - ML time
                        if shouldLogDebug {
                            totalMLTime += DispatchTime.now().uptimeNanoseconds - cropEndTime.uptimeNanoseconds
                        }
                        
                        // Unlock char buffer base address
                        CVPixelBufferUnlockBaseAddress(charBuffer, .readOnly)
                    }
                }
            }
            
            // Debugging stuff
            if shouldLogDebug {
                // Log cache time
                Log.debug("CHARACTERS READ FROM CACHE: \(totalCharsCached)")
                Log.debug("TOTAL CACHE TIME: \(totalCacheTime / 1_000_000)ms")
                
                // Log ML time
                Log.debug("CHARACTERS CLASSIFIED W/ ML: \(totalCharsML)")
                Log.debug("TOTAL ML TIME: \(totalMLTime / 1_000_000)ms")
                
                // Log cropping time
                Log.debug("TOTAL CROPPING TIME (character level): \(totalCropTime / 1_000_000)ms")
                
                // Log total time
                let totalTime = (DispatchTime.now().uptimeNanoseconds - ocrStartTime.uptimeNanoseconds) / 1_000_000
                Log.debug("TOTAL FRAME TIME: \(totalTime)ms")
                
                // Log total characters
                let words = lines.map({$0.words()}).reduce([], +).count
                let chars = lines.map({$0.characters}).reduce([], +).count
                Log.debug("\(lines.count) lines, \(words) words, \(chars) characters found")
            }
            
            // Debug - log OCR output
            if shouldLogOCR {
                let output = lines.map({$0.words().map({$0.string}).joined(separator: " ")}).joined(separator: "\n")
                Log.debug("\n\nOCR OUTPUT:\n\n\(output)\n\n")
            }
            
            // Broadcast results to websocket
            let allWords = lines.map({$0.words()}).reduce([], +)
            Socket.send(.wordsFound(words: allWords))
            
            // Call completion handler (if any - usually used for debugging)
            completion?(lines)
            
            // Unlock filtered buffer base address
            CVPixelBufferUnlockBaseAddress(filteredBuffer, .readOnly)
            
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
    ///   - isInverted: If `true`, the pixel values will be inverted prior to sending to the neural net.
    ///                   This should be used for light text on dark backgrounds.
    /// - Returns: The best classification result from the neural net.
    func classifyImage(_ pixelBuffer: CVPixelBuffer, isInverted: Bool) -> String? {
        // Debug
        if shouldSaveDebugImages && classificationCount < 100 { // Avoid saving thousands of images to disk
            let outputBuffer = isInverted ? pixelBuffer.inverted() : pixelBuffer
            OCRTester.shared.save(outputBuffer, as: "classification-\(classificationCount)")
            classificationCount += 1
        }
        
        // Classify image
        var prediction: MLMultiArray?
        if isInverted {
            // Invert pixel buffer if requested
            let invertedBuffer = pixelBuffer.inverted()
            CVPixelBufferLockBaseAddress(invertedBuffer, .readOnly)
            prediction = (try? ocrModel.prediction(image: invertedBuffer))?.classification
            CVPixelBufferUnlockBaseAddress(invertedBuffer, .readOnly)
        } else {
            prediction = (try? ocrModel.prediction(image: pixelBuffer))?.classification
        }
        
        // Make sure we got a result (shouldn't really be possible for this to be nil)
        guard prediction != nil else { return nil }
        
        // Determine index of maximum probability from output
        let ptr = UnsafeBufferPointer(start: prediction!.dataPointer.assumingMemoryBound(to: Double.self), count: supportedChars.count)
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
