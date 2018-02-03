import Foundation
import AVFoundation
import AppKit

extension Recorder: AVCaptureVideoDataOutputSampleBufferDelegate {
  private func getBufferFrame(_ sampleBuffer: CMSampleBuffer) -> (UnsafeMutablePointer<UInt8>, Int, () -> Void) {
    let pixelBuffer: CVPixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)!
    CVPixelBufferLockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0));
    let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0)
    let buffer = unsafeBitCast(baseAddress, to: UnsafeMutablePointer<UInt8>.self)
    let perRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)
    let release: () -> Void = {
      CVPixelBufferUnlockBaseAddress(pixelBuffer, CVPixelBufferLockFlags(rawValue: 0))
    }
    return (buffer, perRow, release)
  }
  
  public func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    // keep this always in sync
    self.currentSampleBuffer = sampleBuffer
    // todo: use this per-box
    if self.isScanning || self.boxes.count == 0 {
      return
    }
    // get frame
    let (buffer, perRow, release) = self.getBufferFrame(sampleBuffer)
    // one time setup
    if self.characters == nil {
      characters = Characters(
        buffer: buffer,
        perRow: perRow,
        isBlackIfUnder: 180
      )
      characters!.shouldDebug = shouldDebug
    } else {
      self.characters!.buffer = buffer
      if shouldDebug { characters!.debugDir = self.boxes.first!.value.screenDir! }
    }
    // debounce while scrolling amt in seconds:
    let delayHandleChange = 0.25
    // loop over boxes and check
    for boxId in self.boxes.keys {
      let box = self.boxes[boxId]!
      let changedBox = hasBoxChanged(box: box, buffer: buffer, perRow: perRow)
      if (firstTime && box.initialScreenshot || !firstTime && changedBox) {
        // options to ignore next or to force next
        if ignoreNextScan && !shouldRunNextTime {
          self.ignoreNextScan = false
          return // todo should work better with multiple boxes
        }
        if shouldRunNextTime {
          self.shouldRunNextTime = false
        }
        // send clear on change
        self.send("{ \"action\": \"clearWord\", \"value\": \"\(box.id)\" }")
        if !box.findContent {
          continue
        }
        // content/ocr related stuff:
        // debounce
        if (self.changeHandle != nil) {
          print("canceling last")
          self.changeHandle!.cancel()
          self.changeHandle = nil
          self.isScanning = false
          self.ignoreNextScan = false
          self.shouldCancel = false
        }
        // wait for 2 frames of clear
        // small delay by default to not pick up old highlights that havent cleared yet
        self.changeHandle = Async.userInteractive(after: changedBox ? delayHandleChange : 0.02) { // debounce (seconds)
          self.isScanning = true
          // update characters buffer
          let (buffer, _, release) = self.getBufferFrame(sampleBuffer)
          self.characters!.buffer = buffer
          // handle change
          if let frame = self.handleChangedArea(
            box: box,
            sampleBuffer: self.currentSampleBuffer!,
            perRow: perRow,
            findContent: true
            ) {
            self.frames[boxId] = frame
          }
          release()
          // after x seconds, re-enable watching
          // this is because screen needs time to update highlight boxes
          Async.main(after: 0.05) {
            print("re-enable scan after last")
            self.shouldCancel = false
            self.isScanning = false
            self.ignoreNextScan = true
          }
        }
      }
    }
    // only true for first loop
    self.firstTime = false
    // release
    release()
  }
}

