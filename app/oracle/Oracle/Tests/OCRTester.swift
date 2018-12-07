//
//  OCRTester.swift
//  Oracle
//
//  Created by Collin Hundley on 12/6/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import AppKit
import AVFoundation



/* ---------- IMPORTANT INFO ----------
 
 To avoid bundling test screenshots into the main app bundle,
 we determine image location at runtime using an environment variable.
 
 The environment variable `projectDir` is set to `$(PROJECT_DIR)`, which Xcode
 replaces with the project's absolute path at compile time. Images are then extracted
 from `/Test-Input/` in the main project directory. This allows Oracle to find the test images
 on anybody's system, regardless of project/build location, without bloating the production app bundle.
 
 If needed, the environment variable can be changed by navigating to Product > Scheme > Edit Scheme...
 and selecting the Arguments tab.
 
 */


class OCRTester {

 
    // --------- TESTING OPTIONS -----------
    
    /// If `true`, extracted character images will be saved to the `TestOutput` directory at the project root.
    /// This slows down performance significantly, so any performance logging can be
    /// disregarded while this flag is enabled.
    fileprivate let saveImages = false
    
    // -------------------------------------
    
    
    static let shared = OCRTester()
    
    /// Filenames for all test images (without file extension).
    private let imageNames: [String] = [
        "article-1",
        "article-2-small",
        "article-2-large",
        "article-3-small",
        "article-3-large",
        "code",
        "github-1-small",
        "github-1-large",
        "github-2-small",
        "github-2-large",
        "imac-pro",
        "imac",
        "reddit",
        "slack-small",
        "slack-large"
    ]
    
    
    var projectDirectory: String? {
        return ProcessInfo.processInfo.environment["projectDir"]
    }
    
    /// All test images.
    var testImages: [NSImage] {
        guard let projectDir = projectDirectory else {
            Log.debug("ERROR: Missing projectDir environment variable. Test image location unknown.")
            return []
        }
        return imageNames.compactMap { (name) -> NSImage? in
            guard let image = NSImage(contentsOfFile: projectDir + "/Test-Input/\(name).png") else {
                Log.debug("ERROR: Missing test image from input directory: \(name).png")
                return nil
            }
            return image
        }
    }
    
}


// MARK: Public API

extension OCRTester {
    
    
    /// Instructs the tester to watch a specific region of the screen for changes.
    ///
    /// - Parameter bounds: The screen bounds of interest, in pixels (not points).
    func watchBounds(_ bounds: CGRect) {
        ScreenRecorder.shared.start()
        ScreenRecorder.shared.watchBounds(bounds)
    }
    
    
    /// Runs a series of OCR tests using screenshots containing a variety of content.
    func testScreenshots() {
        
        // Just testing this screenshot right now...
        let image = testImages[2]
        let buffer = createBuffer(from: image)
        CVPixelBufferLockBaseAddress(buffer, .readOnly)
        let baseAddress = CVPixelBufferGetBaseAddressOfPlane(buffer, 0)!
        let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(buffer, 0)
        var rect = CGRect(origin: .zero, size: image.size)
        let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil)! // To get true pixel size (not just points)
        OCRManager.shared.performOCR(on: baseAddress,
                                     bytesPerRow: bytesPerRow,
                                     bounds: CGRect(x: 0, y: 0, width: cgImage.width, height: cgImage.height))
    }
    
}


// MARK: Utilities

fileprivate extension OCRTester {
    
    func createBuffer(from image: NSImage) -> CVPixelBuffer {
        var rect = CGRect(x: 0, y: 0, width: image.size.width, height: image.size.height)
        let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
        let ciImage = CIImage(cgImage: cgImage)
        let context = CIContext()
        var pixelBuffer: CVPixelBuffer?
        let pixelFormat = kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
        _ = CVPixelBufferCreate(nil,
                                cgImage.width,
                                cgImage.height,
                                pixelFormat,
                                nil,
                                &pixelBuffer)
        context.render(ciImage, to: pixelBuffer!)
        return pixelBuffer!
    }
    
    
    func createImage(from pixelBuffer: CVPixelBuffer, size: CGSize) -> CGImage {
        let ciImage = CIImage(cvPixelBuffer: pixelBuffer)
        let context = CIContext()
        return context.createCGImage(ciImage, from: CGRect(x: 0, y: 0, width: size.width, height: size.height))!
    }
    
    
    func resize(_ image: CGImage, targetSize: CGSize) -> CGImage {
        let rect = CGRect(x: 0, y: 0, width: targetSize.width, height: targetSize.height)
        let context = CGContext(data: nil,
                                width: Int(targetSize.width),
                                height: Int(targetSize.height),
                                bitsPerComponent: image.bitsPerComponent,
                                bytesPerRow: image.bytesPerRow,
                                space: image.colorSpace!,
                                bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
        context.draw(image, in: rect)
        return context.makeImage()!
    }
    
}


// MARK: Saving

extension OCRTester {
    
    /// Saves the given NSImage to disk in the project test output directory.
    ///
    /// - Parameters:
    ///   - image: The image to save.
    ///   - name: The filename (without extension).
    func save(_ image: NSImage, as name: String) {
        guard let projectDir = projectDirectory else {
            return Log.debug("ERROR: Missing projectDir environment variable. Unable to save image outputs.")
        }
        let url = URL(fileURLWithPath: projectDir + "/Test-Output/\(name).png")
        let bitmap = image.representations[0] as! NSBitmapImageRep
        let png = bitmap.representation(using: .png, properties: [:])!
        try! png.write(to: url)
    }
    
    
    /// Saves the given CGImage to disk in the project test output directory.
    ///
    /// - Parameters:
    ///   - image: The image to save.
    ///   - name: The filename (without extension).
    func save(_ image: CGImage, as name: String) {
        guard let projectDir = projectDirectory else {
            return Log.debug("ERROR: Missing projectDir environment variable. Unable to save image outputs.")
        }
        let url = URL(fileURLWithPath: projectDir + "/Test-Output/\(name).png")
        let bitmap = NSBitmapImageRep(cgImage: image)
        let png = bitmap.representation(using: .png, properties: [:])!
        try! png.write(to: url)
    }
    
    
    /// Saves the given CVPixelBuffer to disk in the project test output directory.
    ///
    /// - Parameters:
    ///   - image: The image to save.
    ///   - name: The filename (without extension).
    func save(_ pixelBuffer: CVPixelBuffer, as name: String) {
        guard let projectDir = projectDirectory else {
            return Log.debug("ERROR: Missing projectDir environment variable. Unable to save image outputs.")
        }
        let url = URL(fileURLWithPath: projectDir + "/Test-Output/\(name).png")
        let width = CVPixelBufferGetWidth(pixelBuffer)
        let height = CVPixelBufferGetHeight(pixelBuffer)
        let ciImage = CIImage(cvPixelBuffer: pixelBuffer)
        let context = CIContext()
        let cgImage = context.createCGImage(ciImage, from: CGRect(x: 0, y: 0, width: width, height: height))!
        let bitmap = NSBitmapImageRep(cgImage: cgImage)
        let png = bitmap.representation(using: .png, properties: [:])!
        try! png.write(to: url)
    }
    
}
