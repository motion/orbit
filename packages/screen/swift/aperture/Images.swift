import Foundation
import AppKit
import AVFoundation

public struct PixelData {
  var a:UInt8 = 255
  var r:UInt8
  var g:UInt8
  var b:UInt8
}

class Images {
  func writeCGImage(image: CGImage, to destination: String, resolution: Int = 300) {
    let destinationURL = URL(fileURLWithPath: destination)
    guard let finalDestination = CGImageDestinationCreateWithURL(destinationURL as CFURL, kUTTypePNG, 1, nil) else { return }
    let properties: NSDictionary = [
      kCGImageDestinationLossyCompressionQuality: 1,
      kCGImagePropertyDPIHeight: resolution,
      kCGImagePropertyDPIWidth: resolution
    ]
    CGImageDestinationAddImage(finalDestination, image, properties)
    CGImageDestinationFinalize(finalDestination)
  }
  
  func resize(_ image: NSImage, w: Int, h: Int) -> NSImage {
    let destSize = NSMakeSize(CGFloat(w), CGFloat(h))
    let newImage = NSImage(size: destSize)
    newImage.lockFocus()
    image.draw(in: NSMakeRect(0, 0, destSize.width, destSize.height), from: NSMakeRect(0, 0, image.size.width, image.size.height), operation: NSCompositingOperation.sourceOver, fraction: CGFloat(1))
    newImage.unlockFocus()
    newImage.size = destSize
    return NSImage(data: newImage.tiffRepresentation!)!
  }
  
  func cropImage(_ image: CGImage, box: CGRect) -> CGImage {
    return image.cropping(to: box)!
  }

  func imageFromSampleBuffer(_ context: CIContext, sampleBuffer: CMSampleBuffer, cropRect: CGRect) -> CGImage? {
    guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return nil }
    var ciImage = CIImage(cvPixelBuffer: imageBuffer)
    ciImage = ciImage.cropped(to: cropRect)
    guard let cgImage = context.createCGImage(ciImage, from: ciImage.extent) else { return nil }
    return cgImage
  }
  
  func resize(_ image: CGImage, width: Int, height: Int) -> CGImage? {
    var ratio: Float = 0.0
    let imageWidth = Float(image.width)
    let imageHeight = Float(image.height)
    let maxWidth: Float = Float(width)
    let maxHeight: Float = Float(height)
    // Get ratio (landscape or portrait)
    if (imageWidth > imageHeight) {
      ratio = maxWidth / imageWidth
    } else {
      ratio = maxHeight / imageHeight
    }
    // Calculate new size based on the ratio
    // this would prevent sizing it up but we want that
    //    if ratio > 1 {
    //      ratio = 1
    //    }
    let mWidth = imageWidth * ratio
    let mHeight = imageHeight * ratio
    guard let colorSpace = image.colorSpace else { return nil }
    guard let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: image.bitsPerComponent, bytesPerRow: image.bytesPerRow, space: colorSpace, bitmapInfo: image.alphaInfo.rawValue) else { return nil }
    // white background
    context.clear(CGRect(x: 0, y: 0, width: width, height: height))
    context.setFillColor(CGColor(gray: 1, alpha: 1))
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    // draw image to context (resizing it)
    context.interpolationQuality = .high
    context.draw(image, in: CGRect(x: 0, y: 0, width: Int(mWidth), height: Int(mHeight)))
    // call .makeImage to turn to image
    return context.makeImage()
  }
  
  func imageFromArray(pixels: [PixelData], width: Int, height: Int) -> CGImage? {
    assert(pixels.count == Int(width * height))
    let pixelDataSize = MemoryLayout<PixelData>.size
    let data: Data = pixels.withUnsafeBufferPointer {
      return Data(buffer: $0)
    }
    let cfdata = NSData(data: data) as CFData
    let provider: CGDataProvider! = CGDataProvider(data: cfdata)
    if provider == nil {
      print("CGDataProvider is not supposed to be nil")
      return nil
    }
    let cgimage: CGImage! = CGImage(
      width: width,
      height: height,
      bitsPerComponent: 8,
      bitsPerPixel: 32,
      bytesPerRow: width * pixelDataSize,
      space: CGColorSpaceCreateDeviceRGB(),
      bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedFirst.rawValue),
      provider: provider,
      decode: nil,
      shouldInterpolate: false,
      intent: .defaultIntent
    )
    return cgimage
  }
}
