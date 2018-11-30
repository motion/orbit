//
//  ScreenRecorder.swift
//  Oracle
//
//  Created by Collin Hundley on 10/8/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation
import AVFoundation
import AppKit
import CoreGraphics


/// Manages screen recording for OCR purposes.
/// Also keeps track of whether a screen has changed, triggering OCR when necessary.
class ScreenRecorder: NSObject {
    
    /// Shared instance.
    static let shared = ScreenRecorder()
    
    /// Screen capture session.
    fileprivate var session: AVCaptureSession!
    
    /// Capture session input.
    fileprivate var input: AVCaptureScreenInput!
    
    /// The screen bounds to observe, in *PIXEL* coordinates (not points).
    fileprivate var bounds: CGRect?
    
    /// Pixel cache used to determine whether the screen has changed between frames.
    /// Here we store only the luma value for each cached pixel.
    fileprivate var pixelCache = [UInt8]()
    
    /// Step size for pixel cache.
    /// i.e. store the luma value for every nth pixel.
    fileprivate let pixelCacheStep = 10
    
    
    private override init() {
        super.init()
        
        // Setup screen recording output
        setupCaptureSession()
    }
    
}


// MARK: Capture session setup

fileprivate extension ScreenRecorder {
    
    func setupCaptureSession() {
        session = AVCaptureSession()
        
        // Setup video input
        // TODO: Support alternate displays
        guard let input = AVCaptureScreenInput(displayID: CGMainDisplayID()) else {
            return Log.error("ERROR: unable to create video input.")
        }
        
        input.minFrameDuration = CMTime(value: 1, timescale: 4) // Default 4 fps
        input.capturesCursor = false // Default don't capture cursor
        
        self.input = input
        if session.canAddInput(input) {
            session.addInput(input)
        }
        
        // Setup video output
        let output = AVCaptureVideoDataOutput()
        output.videoSettings = [
            kCVPixelBufferPixelFormatTypeKey as String : kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
        ]
        output.alwaysDiscardsLateVideoFrames = true
        output.setSampleBufferDelegate(self, queue: DispatchQueue.main)
        if session.canAddOutput(output) {
            session.addOutput(output)
        }
    }
    
}


// MARK: Public API

extension ScreenRecorder {
    
    /// Starts/resumes recording screen frames.
    /// Must be called from the main queue.
    func start() {
        Log.info("Starting recording")
        session.startRunning()
    }
    
    
    /// Stops/pauses screen frame recording.
    /// Must be called from the main queue.
    func stop() {
        Log.info("Stopping recording")
        session.stopRunning()
    }
    
    
    /// Instructs the screen recorder to start watching new bounds.
    /// Must be called from the main queue.
    ///
    /// - Parameter bounds: The bounds to watch. This must be in *PIXEL* values (not points).
    func watchBounds(_ bounds: CGRect) {
        Log.info("Watching bounds: \(bounds)")
        self.bounds = bounds
    }
    
    
    /// Sets the frames per second of the screen recorder.
    /// Must be called from the main queue.
    ///
    /// - Parameter fps: The desired FPS.
    func setFPS(_ fps: Int) {
        Log.info("Setting FPS: \(fps)")
        input.minFrameDuration = CMTime(value: 1, timescale: Int32(fps))
    }
    
}


// MARK: Video output delegate

extension ScreenRecorder: AVCaptureVideoDataOutputSampleBufferDelegate {
    
    /// Called when a new screen frame is captured.
    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        // Ignore frame if our bounds is nil or zero
        guard let bounds = self.bounds, !bounds.isEmpty else {
            return
        }
        
        // Extract pixel buffer data from sample
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            return Log.error("ERROR: Unable to convert CMSampleBuffer to CVPixelBuffer.")
        }
        
        // Lock pixel buffer base address
        CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
        
        // Get base address of luma plane
        guard let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0) else {
            return Log.error("ERROR: Unable to get base address of screen pixel buffer (plane 0).")
        }
        
        // Get bytes per row of luma plane
        let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)
        
        // Only continue if the screen content has changed
        guard isNewFrame(baseAddress: baseAddress, bytesPerRow: bytesPerRow, bounds: bounds) else {
            return
        }
        
        // Instruct OCR manager to handle new frame
        OCRManager.shared.performOCR(on: baseAddress, bytesPerRow: bytesPerRow, bounds: bounds)
        
        // Unlock pixel buffer
        CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
    }
    
}


// MARK: Caching

fileprivate extension ScreenRecorder {
    
    /// Determines whether the provided frame is new (i.e. the screen content has changed).
    /// Only the set bounds are checked.
    ///
    /// - Parameters:
    ///   - pixelBuffer: Pixel buffer containing the full screen contents.
    ///   - baseAddress: The pixel buffer's luma plane base address.
    /// - Returns: `true` if the screen content within the bounds has changed, else `false`.
    func isNewFrame(baseAddress: UnsafeMutableRawPointer, bytesPerRow: Int, bounds: CGRect) -> Bool {
        let startX = Int(bounds.minX)
        let startY = Int(bounds.minY)
        let sampleRows = Int(bounds.height) / pixelCacheStep
        let sampleCols = Int(bounds.width) / pixelCacheStep
        
        // Storage for this new frame's cache
        var frameCache = [UInt8](repeating: 0, count: sampleRows * sampleCols)
        
        // Extract luma data from pixel buffer
        let pixels = baseAddress.assumingMemoryBound(to: UInt8.self)

        // Loop through pixels and store luma value at each step
        for row in 0..<sampleRows {
            let actualRow = startY + row * pixelCacheStep
            for col in 0..<sampleCols {
                let actualCol = startX + col * pixelCacheStep
                let pixelIdx = actualRow * bytesPerRow + actualCol
                frameCache.append(pixels[pixelIdx])
            }
        }
        
        // Check if screen content has changed
        if frameCache != pixelCache {
            pixelCache = frameCache
            return true
        }
        
        // No change
        return false
    }
    
}
