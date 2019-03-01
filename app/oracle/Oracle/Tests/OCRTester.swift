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
    fileprivate let saveImages = true
    
    // -------------------------------------
    
    
    static let shared = OCRTester()
    
    /// Filenames for all test images (without file extension).
    fileprivate let imageNames: [String] = [
        "article-1",
        "article-2-small",
        "article-2-large",
        "article-3-small",
        "article-3-large",
        "article-4-small",
        "article-4-large",
        "code",
        "email-1-small",
        "email-1-large",
        "email-2-small",
        "email-2-large",
        "email-3-small",
        "email-3-large",
        "github-1-small",
        "github-1-large",
        "github-2-small",
        "github-2-large",
        "imac-pro",
        "imac",
        "iphone-small",
        "iphone-large",
        "mac-small",
        "mac-large",
        "pdf-1-small",
        "pdf-1-large",
        "pdf-2-small",
        "pdf-2-large",
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
        // Test all screenshots recursively
        testScreenshot(0, of: testImages.count) {
            // Done
            Log.info("\n\n--------------- TESTING COMPLETED ---------------\n\n")
        }
    }
    
}


// MARK: Saving (also public)

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


// MARK: Testing

fileprivate extension OCRTester {
    
    
    /// Tests the screenshot at the provided index,
    /// and then continues recursively until all screenshots have been tested.
    ///
    /// This method tests each screenshot twice: once "cold" to simulate performance without prior cache,
    /// and once "hot" to simulate performance after the frame has been cached.
    ///
    /// - Parameters:
    ///   - index: The index of the screenshot to test, in the `testImages` array.
    ///   - total: The total number of screenshots to test (less than or equal to `testImages.count`).
    ///   - completion: Completion handler to be called after ALL testing has completed (all screenshots).
    func testScreenshot(_ index: Int, of total: Int, completion: @escaping () -> Void) {
        // Exit recursion when we've reached the last index
        if index == total {
            completion()
            return
        }
        
        // Convert screenshot image to pixel buffer
        let image = testImages[index]
        let buffer = createBuffer(from: image)
        CVPixelBufferLockBaseAddress(buffer, .readOnly)
        let baseAddress = CVPixelBufferGetBaseAddressOfPlane(buffer, 0)!
        let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(buffer, 0)
        var rect = CGRect(origin: .zero, size: image.size)
        let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil)! // To get true pixel size (not just points)
        
        // Completion handler - called after 2nd pass has completed
        let screenshotCompletion: (([Line]) -> Void)? = { [unowned self] (lines) in
            DispatchQueue.main.async {
                // Unlock pixel buffer base address
                CVPixelBufferUnlockBaseAddress(buffer, .readOnly)
                
                // Flush character cache
                CharacterCache.shared.flush()
                
                // Save image output w/ overlay (only if image output flag is enabled)
                if shouldSaveDebugImages {
                    let output = self.drawLines(lines, on: cgImage)
                    self.save(output, as: self.imageNames[index])
                }
                
                // Continue to next screenshot
                self.testScreenshot(index + 1, of: total, completion: completion)
            }
        }
        
        // Perform 1st "cold" OCR pass
        Log.debug("\n\n--------------- \(imageNames[index]) (\(cgImage.width)x\(cgImage.height)) - 1ST PASS ---------------\n\n")
        OCRManager.shared.performOCR(on: baseAddress,
                                     bytesPerRow: bytesPerRow,
                                     bounds: CGRect(x: 0, y: 0, width: cgImage.width, height: cgImage.height)) { [unowned self] (lines) in

            // Perform 2nd "warm" OCR pass
            Log.debug("\n\n--------------- \(self.imageNames[index]) (\(cgImage.width)x\(cgImage.height)) - 2ND PASS ---------------\n\n")
            DispatchQueue.main.async {
                // Run again
                OCRManager.shared.performOCR(on: baseAddress,
                                             bytesPerRow: bytesPerRow,
                                             bounds: CGRect(x: 0, y: 0, width: cgImage.width, height: cgImage.height),
                                             completion: screenshotCompletion)
            }
        }
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
    
    
    func drawLines(_ lines: [Line], on image: CGImage) -> CGImage {
        // Create CGContext
        let context = CGContext(data: nil,
                                width: image.width,
                                height: image.height,
                                bitsPerComponent: 8,
                                bytesPerRow: image.width * 4,
                                space: CGColorSpaceCreateDeviceRGB(),
                                bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
        
        // Draw original image in background
        context.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
        
        // Create an NSGraphicsContext with our CGContext
        // We need this to draw the attributed strings
        NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)
        
        // Draw each character individually
        for line in lines {
            for char in line.characters {
                guard let classification = char.classification else { continue }
                let charBounds = char.lineHeightBounds(with: line.bounds)
                let attrString = NSMutableAttributedString(string: classification, attributes: [
                    NSAttributedString.Key.foregroundColor : NSColor(red: 1, green: 0, blue: 0, alpha: 0.8),
                    NSAttributedString.Key.font : NSFont.systemFont(ofSize: charBounds.height)
                    ])
                
                // Draw character in context
                let origin = NSPoint(x: charBounds.minX,
                                     y: CGFloat(image.height) - charBounds.maxY)
                attrString.draw(at: origin)
            }
        }
        
        // Extract image from CGContext
        return context.makeImage()!
    }
    
}
