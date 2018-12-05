//
//  Utils.swift
//  CharacterGenerator
//
//  Created by Collin Hundley on 10/30/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa
import CoreGraphics
import Vision


// MARK: Utilities

/// Resizes an image to new dimensions, preserving aspect ratio.
func resize(_ cgImage: CGImage, to size: CGSize) -> CGImage {
    let imgAspect = CGFloat(cgImage.width) / CGFloat(cgImage.height)
    let sizeAspect = size.width / size.height
    let imgNewWidth = imgAspect >= sizeAspect ? size.width : imgAspect * size.width
    let imgNewHeight = imgAspect < sizeAspect ? size.height : size.height / imgAspect
    let imgNewX = (size.width - imgNewWidth) / 2
    let imgNewY = (size.height - imgNewHeight) / 2
    let imgNewRect = CGRect(x: imgNewX, y: imgNewY, width: imgNewWidth, height: imgNewHeight)
    
    let context = CGContext(data: nil,
                            width: Int(size.width), height: Int(size.height),
                            bitsPerComponent: cgImage.bitsPerComponent, bytesPerRow: Int(size.width) * 4,
                            space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
    
    context.setFillColor(CGColor.white)
    context.fill(CGRect(x: 0, y: 0, width: size.width, height: size.height))
    context.draw(cgImage, in: imgNewRect)
    
    return context.makeImage()!
}


/// Float range [0, 1] (0 is white, 1 is black).
func pixels(from cgImage: CGImage, threshold: Bool) -> [Float] {
    let ciImage = CIImage(cgImage: cgImage)
    let context = CIContext(options: nil)
    var pixelBuffer: CVPixelBuffer!
    let pixelFormat = kCVPixelFormatType_OneComponent8
    _ = CVPixelBufferCreate(nil, cgImage.width, cgImage.height,
                            pixelFormat, nil, &pixelBuffer)
    context.render(ciImage, to: pixelBuffer)
    
    CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
    let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)!
    
    // Test
//    let testImg = CIImage(cvPixelBuffer: pixelBuffer)
//    let cgImageTest = context.createCGImage(testImg, from: CGRect(x: 0, y: 0, width: cgImage.width, height: cgImage.height))!
//    let bitmap = NSBitmapImageRep(cgImage: cgImageTest)
//    let png = bitmap.representation(using: .png, properties: [:])!
//    try! png.write(to: URL(fileURLWithPath: "/Users/Collin/Documents/Orbit/CharacterGenerator/Output/\(i).png"))
//    i += 1
    
    let ptr = baseAddress.assumingMemoryBound(to: UInt8.self)
    
    // Note: Here we must account for the fact that pixel buffers are always paged at 64 bytes per row.
    // If our actual image width (x4 for RGBA) isn't a multiple of 64, we must make sure we index the pixels correctly.
    // Essentially, we're skipping the trailing zeros in each row that are placed there by macOS.
    let bufferWidth = CVPixelBufferGetBytesPerRow(pixelBuffer) // Int(ceil(Double(cgImage.width) * 4 / 64) * 16)
    let bufferSize = bufferWidth * cgImage.height
    let pixels = UnsafeBufferPointer(start: ptr, count: bufferSize)
    var output = [Float](repeating: 0, count: cgImage.width * cgImage.height)
    for row in 0..<cgImage.height {
        for col in 0..<cgImage.width {
            let bufferIdx = row * bufferWidth + col
            let outputIdx = row * cgImage.width + col
            if threshold {
                output[outputIdx] = pixels[bufferIdx] < 100 ? 1.0 : 0.0
            } else {
                output[outputIdx] = 1 - Float(pixels[bufferIdx]) / 255.0
            }
        }
    }
    
    CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
    
    return output
}


/// Finds the exact bounding box of the character contained in the given image.
/// We do this because characters are drawn surrounded by whitespace by default,
/// so this lets us crop to the exact size of the character
/// (which is what Vision framework does during text detection).
func findBoundingBox(in cgImage: CGImage) -> CGRect {
    let ciImage = CIImage(cgImage: cgImage)
    let context = CIContext(options: nil)
    var pixelBuffer: CVPixelBuffer!
    let pixelFormat = kCVPixelFormatType_OneComponent8
    _ = CVPixelBufferCreate(nil, cgImage.width, cgImage.height,
                            pixelFormat, nil, &pixelBuffer)
    context.render(ciImage, to: pixelBuffer)
    
    CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
    let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)!
    
    let ptr = baseAddress.assumingMemoryBound(to: UInt8.self)
    
    let bufferWidth = CVPixelBufferGetBytesPerRow(pixelBuffer) // Int(ceil(Double(cgImage.width) * 4 / 64) * 16)
    let bufferSize = bufferWidth * cgImage.height
    let pixels = UnsafeBufferPointer(start: ptr, count: bufferSize)
    
    var minX = cgImage.width
    var minY = cgImage.height
    var maxX = 0
    var maxY = 0
    
    for row in 0..<cgImage.height {
        for col in 0..<cgImage.width {
            let bufferIdx = row * bufferWidth + col
            // Note: Here black is 0, white is 255
            if pixels[bufferIdx] < 255 {
                // Found a non-white pixel
                minX = min(minX, col)
                minY = min(minY, row)
                maxX = max(maxX, col)
                maxY = max(maxY, row)
            }
        }
    }
    
    // Unlock buffer
    CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
    
    return CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
}
