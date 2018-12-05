//
//  Vision.swift
//  CharacterGenerator
//
//  Created by Collin Hundley on 11/2/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa
import Vision


/// Extracts character boxes from a full image frame.
///
/// - Parameters:
///   - pixelBuffer: The pixel buffer containing the full window of interest.
///   - completion: Completion handler, containing
func extractChars(from cgImage: CGImage, completion: @escaping (_ characterBoxes: [CGRect]) -> Void) {
    // Compute original image size
    let originalSize = CGSize(width: cgImage.width, height: cgImage.height)
    
    // Create a request for detecting text boxes
    let request = VNDetectTextRectanglesRequest { (request, error) in
        
        // Note: failing silently right now and returning empty result set.
        if let error = error {
            print("Error extracting characters from image buffer: \(error)")
            completion([])
            return
        }
        
        // Convert results to the right type
        guard let textObservations = request.results as? [VNTextObservation] else {
            // Shouldn't be possible
            print("Error extracting characters from image buffer: couldn't convert result set to VNTextObservation.")
            completion([])
            return
        }
        
        // Make sure we have some results
        guard !textObservations.isEmpty else {
            // No character boxes found
            completion([])
            return
        }
        
        // Get char boxes
        let charBoxes = getCharBoxes(from: textObservations, originalSize: originalSize)
        
        // Return
        completion(charBoxes)
    }
    
    request.reportCharacterBoxes = true
    
    // Create handler for this image
    let handler = VNImageRequestHandler(cgImage: cgImage)
    
    // Execute request on background queue
    DispatchQueue.global(qos: .userInteractive).async {
        do {
            // Execute request
            try handler.perform([request])
        } catch {
            print("Error performing text detection request: \(error)")
            completion([])
        }
    }
}


/// Extracts all character boxes from an array of `VNTextObservation`s.
///
/// - Parameter textObservations: An array of text observations returned by the request.
/// - Returns: An array of character boxes as `[CGRect]`
private func getCharBoxes(from textObservations: [VNTextObservation], originalSize: CGSize) -> [CGRect] {
    // Extract all character boxes from all text observations
    let boxes = textObservations.compactMap{$0.characterBoxes}.reduce([], +).map{$0.boundingBox}
    
    // Vision framework returns character boxes normalized to the original image size,
    // with origin at the bottom left corner.
    // Here we convert all boxes back to pixel values, with origin at the top left corner.
    let frames = boxes.map { (box) -> CGRect in
        let translation = CGAffineTransform(scaleX: originalSize.width, y: -originalSize.height)
            .translatedBy(x: 0, y: -1)
        return box.applying(translation)
    }
    return frames
}
