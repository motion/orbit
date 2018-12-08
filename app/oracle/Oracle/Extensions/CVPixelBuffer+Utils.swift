//
//  OCRUtilities.swift
//  Oracle
//
//  Created by Collin Hundley on 11/26/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation
import AVFoundation
import Accelerate



extension CVPixelBuffer {
    
    /// Crops a YUV (multi-planar) CVPixelBuffer to the desired bounds.
    /// IMPORTANT: This method returns a new grayscale CVPixelBuffer with format kCVPixelFormatType_OneComponent8.
    /// The pixel buffer for the base address provided MUST be in YUV format (kCVPixelFormatType_420YpCbCr8BiPlanarFullRange).
    ///
    /// - Parameters:
    ///   - rect: The bounds to crop to, in pixels.
    ///   - baseAddress: The base address of the pixel buffer's first (Y) plane.
    ///   - bytesPerRow: The number of bytes per row.
    /// - Returns: A newly-created pixel buffer. Bytes are copied, so the original buffer may safely be released.
    static func cropYUVToGrayscale(to rect: CGRect, baseAddress: UnsafeMutableRawPointer, bytesPerRow: Int) -> CVPixelBuffer? {
        // Compute starting pixel position
        let startPos = Int(rect.minY) * bytesPerRow + Int(rect.minX)
        
        // Create vImage buffer from pixel buffer
        var inBuffer = vImage_Buffer(data: baseAddress + startPos,
                                     height: UInt(rect.height),
                                     width: UInt(rect.width),
                                     rowBytes: bytesPerRow)
        
        // Allocate memory for output buffer
        let outImg = malloc(Int(rect.width * rect.height))
        
        // Create vImage output buffer
        var outBuffer = vImage_Buffer(data: outImg,
                                      height: UInt(rect.height),
                                      width: UInt(rect.width),
                                      rowBytes: Int(rect.width))
        
        // Perform scale (+ crop)
        vImageScale_Planar8(&inBuffer, &outBuffer, nil, 0)
        
        // Convert output buffer to new CVPixelBuffer
        var croppedBuffer: CVPixelBuffer?
        let releaseCallback: CVPixelBufferReleaseBytesCallback = { _, ptr in
            if let ptr = ptr {
                free(UnsafeMutableRawPointer(mutating: ptr))
            }
        }
        let status = CVPixelBufferCreateWithBytes(nil, Int(rect.width), Int(rect.height),
                                                  kCVPixelFormatType_OneComponent8,
                                                  outImg!, Int(rect.width), releaseCallback,
                                                  nil, nil, &croppedBuffer)
        
        // Check for success
        guard status == kCVReturnSuccess else {
            free(outImg)
            Log.error("Error creating CVPixelBuffer from cropped buffer.")
            return nil
        }
        
        // Return
        return croppedBuffer
    }
    
    
    /// Crops a grayscale CVPixelBuffer to a specified region, and scales to a given size (if provided).
    /// NOTE: Original image aspect ratio is maintained; image is padded with white to reach given size.
    ///
    /// - Parameters:
    ///   - rect: The bounds to crop to.
    ///   - size: Optionally, a size to scale the output to.
    ///   - baseAddress: The pixel buffer's base address.
    ///   - bytesPerRow: The number of bytes per row.
    ///   - inverted: `true` if the image is inverted (light text on dark background).
    /// - Returns: A newly-created pixel buffer. Bytes are copied, so the original buffer may safely be released.
    static func cropGrayscale(to rect: CGRect, size: CGSize? = nil, baseAddress: UnsafeMutableRawPointer, bytesPerRow: Int, inverted: Bool) -> CVPixelBuffer? {
        // For convenience
        let outWidth = Int(size?.width ?? rect.width)
        let outHeight = Int(size?.height ?? rect.height)
        
        // Calculate final scaled image size (maintaining aspect ratio)
        var rectNewWidth: Int
        var rectNewHeight: Int
        if let size = size {
            let sizeAspect = size.width / size.height
            let rectAspect = rect.width / rect.height
            // If wider or the same as the output size
            rectNewWidth = rectAspect >= sizeAspect ? Int(size.width) : Int(rectAspect * size.width)
            // If narrower than the output size
            rectNewHeight = rectAspect < sizeAspect ? Int(size.height) : Int(size.height / rectAspect)
        } else {
            rectNewWidth = Int(rect.width)
            rectNewHeight = Int(rect.height)
        }
        
        // Compute starting pixel position
        let startPos = Int(rect.minY) * bytesPerRow + Int(rect.minX)
        
        // Create vImage buffer from pixel buffer
        var inBuffer = vImage_Buffer(data: baseAddress + startPos,
                                     height: UInt(rect.height),
                                     width: UInt(rect.width),
                                     rowBytes: bytesPerRow)
     
        // Allocate memory for output buffer
        let outImg = malloc(outWidth * outHeight)
        if inverted {
            // Fill with zeros (black)
            memset(outImg, 0x00, outWidth * outHeight)
        } else {
            // Fill with ones (white)
            memset(outImg, 0xff, outWidth * outHeight)
        }
        
        // Create vImage output buffer
        let outStartX = (outWidth - rectNewWidth) / 2
        let outStartY = (outHeight - rectNewHeight) / 2
        let outStartPos = outStartY * outWidth + outStartX
        var outBuffer = vImage_Buffer(data: outImg! + outStartPos,
                                      height: UInt(rectNewHeight),
                                      width: UInt(rectNewWidth),
                                      rowBytes: outWidth)
        
        // Perform scale (+ crop)
        vImageScale_Planar8(&inBuffer, &outBuffer, nil, UInt32(kvImageBackgroundColorFill))
        
        // Convert output buffer to new CVPixelBuffer
        var croppedBuffer: CVPixelBuffer?
        let releaseCallback: CVPixelBufferReleaseBytesCallback = { _, ptr in
            if let ptr = ptr {
                free(UnsafeMutableRawPointer(mutating: ptr))
            }
        }
        let status = CVPixelBufferCreateWithBytes(nil, outWidth, outHeight,
                                                  kCVPixelFormatType_OneComponent8,
                                                  outImg!, outWidth, releaseCallback,
                                                  nil, nil, &croppedBuffer)
        
        // Check for success
        guard status == kCVReturnSuccess else {
            free(outImg)
            Log.error("Error creating CVPixelBuffer from cropped buffer.")
            return nil
        }
        
        // Return
        return croppedBuffer
    }
    
    
    /// Applies color and contrast filters to the receiver to improve OCR performance.
    /// NOTE: This returns a new CVPixelBuffer, so the original buffer may be safely released.
    func filteredForOCR() -> CVPixelBuffer {
        // Convert buffer to CIImage
        let outputImage = CIImage(cvPixelBuffer: self)
        
        // Setup filter
        let filter = CIFilter(name: "CIColorControls")!
        filter.setValue(8.0, forKey: "inputContrast")
        filter.setValue(outputImage, forKey: kCIInputImageKey)
        
        // Apply filter
        let filteredImage = filter.value(forKey: kCIOutputImageKey) as! CIImage
        
        // Create new CVPixelBuffer from filtered image
        let context = CIContext()
        var outputBuffer: CVPixelBuffer?
        let pixelFormat = kCVPixelFormatType_OneComponent8
        _ = CVPixelBufferCreate(nil, Int(filteredImage.extent.width), Int(filteredImage.extent.height),
                                pixelFormat, nil, &outputBuffer)
        context.render(filteredImage, to: outputBuffer!)
        
        return outputBuffer!
    }
    
    
    /// Inverts the colors of the receiver.
    /// NOTE: This returns a new CVPixelBuffer, so the original buffer may be safely released.
    func inverted() -> CVPixelBuffer {
        // Convert buffer to CIImage
        let outputImage = CIImage(cvPixelBuffer: self)
        
        // Setup filter
        let filter = CIFilter(name: "CIColorInvert")!
        filter.setDefaults()
        filter.setValue(outputImage, forKey: kCIInputImageKey)
        
        // Apply filter
        let filteredImage = filter.value(forKey: kCIOutputImageKey) as! CIImage
        
        // Create new CVPixelBuffer from filtered image
        let context = CIContext()
        var outputBuffer: CVPixelBuffer?
        let pixelFormat = kCVPixelFormatType_OneComponent8
        _ = CVPixelBufferCreate(nil, Int(filteredImage.extent.width), Int(filteredImage.extent.height),
                                pixelFormat, nil, &outputBuffer)
        context.render(filteredImage, to: outputBuffer!)
        
        return outputBuffer!
    }
    
    
    /// Determines whether the contents of a region of the pixel buffer should be inverted.
    /// This method attempts to determine whether the the character contained within the bounds
    /// is light text on a dark background, or dark text on a light background.
    func shouldInvert(bounds: CGRect) -> Bool {
        // Get buffer data
        let pixelData = CVPixelBufferGetBaseAddress(self)!.assumingMemoryBound(to: UInt8.self)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(self)
        
        // Extract pixels from each corner of the bounds
        let topLeft = pixelData[Int(bounds.minY) * bytesPerRow + Int(bounds.minX)]
        let topRight = pixelData[Int(bounds.minY) * bytesPerRow + Int(bounds.maxX)]
        let bottomLeft = pixelData[Int(bounds.maxY) * bytesPerRow + Int(bounds.minX)]
        let bottomRight = pixelData[Int(bounds.maxY) * bytesPerRow + Int(bounds.maxX)]
        
        // If 3 or more corner pixels are dark, assume the background is dark
        var darkCount = 0
        if topLeft <= 128 { darkCount += 1}
        if topRight <= 128 { darkCount += 1}
        if bottomLeft <= 128 { darkCount += 1}
        if bottomRight <= 128 { darkCount += 1}
        
        return darkCount >= 3
    }
    
}



