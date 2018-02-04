import Foundation
import AVFoundation
import AppKit

var restored = [Int]()
var changed = [Int]()

extension Recorder: AVCaptureVideoDataOutputSampleBufferDelegate {
  func hasBoxChanged(box: Box, buffer: UnsafeMutablePointer<UInt8>, perRow: Int) -> (Bool, Bool) {
    let lastBox = self.lastBoxes[box.id]
    var hasLastBox = false
    let boxX = box.x
    let boxY = box.y
    let height = Int(box.height)
    let width = Int(box.width)
    var curBox: [UInt8] = []
    var numChanged = 0
    var hasChanged = false
    let smallH = height/sampleSpacing
    let smallW = width/sampleSpacing
    if (lastBox != nil) {
      hasLastBox = lastBox?.count == smallW * smallH
    }
    let originalBox = self.originalBoxes[box.id]
    let hasOriginalBox = originalBox != nil
    var isRestored = hasOriginalBox && self.isCleared[box.id] == true
//    var uid = 0
    for y in 0..<smallH {
      // iterate col first
      for x in 0..<smallW {
        let realY = y * sampleSpacing * 2 + boxY * 2
        let realX = x * sampleSpacing * 2 + boxX * 2
        let index = y * smallW + x
        let luma = buffer[realY * perRow + realX]
        // uid calc
//        let filled = luma < 200 ? 1 : 2
//        uid += filled * ((x + boxX) + (y + boxY)) * 3 + ((boxY + y) * 5) + ((boxX + x) * 2)
        // only if exact match
        if isRestored {
          if originalBox![index] != luma {
            isRestored = false
          }
        }
        if (hasLastBox) {
          if (lastBox![index] != luma) {
            numChanged = numChanged + 1
            if (numChanged >= sensitivity) {
              hasChanged = true
              break
            }
          }
        }
        curBox.insert(luma, at: index)
      }
      if (hasChanged) {
        break
      }
    }
    self.lastBoxes[box.id] = curBox
    // store first seen box only
    if !hasOriginalBox {
      self.originalBoxes[box.id] = curBox
    }
    return (hasChanged, isRestored)
  }
  
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
    }
    let chars = self.characters!
    chars.buffer = buffer
    var clearIgnoreNext = false
    // debounce while scrolling amt in seconds:
    let delayHandleChange = 0.25
    // loop over boxes and check
    restored = [Int]()
    changed = [Int]()
    for boxId in self.boxes.keys {
      let box = self.boxes[boxId]!
      let (hasChanged, isRestored) = hasBoxChanged(box: box, buffer: buffer, perRow: perRow)
      if isRestored {
        restored.append(box.id)
        self.isCleared[boxId] = false
        continue
      }
      if (firstTime && box.initialScreenshot || !firstTime && hasChanged) {
        // options to ignore next or to force next
        if ignoreNextScan && !shouldRunNextTime {
          clearIgnoreNext = true
          continue
        }
        if shouldRunNextTime {
          self.shouldRunNextTime = false
        }
        changed.append(box.id)
        self.isCleared[boxId] = true
        if !box.findContent {
          continue
        }
        if shouldDebug {
          chars.debugDir = box.screenDir!
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
        self.changeHandle = Async.userInteractive(after: hasChanged ? delayHandleChange : 0.02) { // debounce (seconds)
          self.isScanning = true
          // update characters buffer
          let (buffer, _, release) = self.getBufferFrame(sampleBuffer)
          self.characters!.buffer = buffer
          // handle change
          _ = self.handleChangedArea(
            box: box,
            sampleBuffer: self.currentSampleBuffer!,
            perRow: perRow,
            findContent: true
          )
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
    // emit
    if changed.count > 0 {
      self.send("{ \"action\": \"changed\", \"value\": \(changed.count) }")
      self.send("{ \"action\": \"changedIds\", \"value\": [\(changed.map({ String($0) }).joined(separator: ","))] }")
    }
    if restored.count > 0 {
      self.send("{ \"action\": \"restored\", \"value\": \(restored.count) }")
      self.send("{ \"action\": \"changedIds\", \"value\": [\(restored.map({ String($0) }).joined(separator: ","))] }")
    }
    if clearIgnoreNext {
      self.ignoreNextScan = false
    }
    // only true for first loop
    self.firstTime = false
    // release
    release()
  }
}

