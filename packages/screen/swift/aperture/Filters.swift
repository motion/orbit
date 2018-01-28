import Foundation
import AppKit
import AVFoundation

class Filters {
  func applyFilter(_ filter: CIFilter?, for image: CIImage) -> CIImage {
    guard let filter = filter else { return image }
    filter.setValue(image, forKey: kCIInputImageKey)
    guard let filteredImage = filter.value(forKey: kCIOutputImageKey) else { return image }
    return filteredImage as! CIImage
  }
  
  func imageFromBuffer(_ context: CIContext, sampleBuffer: CMSampleBuffer, cropRect: CGRect) -> CGImage? {
    guard let imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return nil }
    var outputImage = CIImage(cvPixelBuffer: imageBuffer)
    // crop
    outputImage = outputImage.cropped(to: cropRect)
    // resize
    let filter = CIFilter(name: "CILanczosScaleTransform")!
    filter.setValue(0.5, forKey: "inputScale")
    outputImage = applyFilter(filter, for: outputImage)
    guard let cgImage = context.createCGImage(outputImage, from: outputImage.extent) else { return nil }
    return cgImage
  }

  // specialized filter that is best for finding the big area of content
  func filterImageForContentFinding(image: CGImage, scale: Int) -> CGImage {
    var outputImage = CIImage(cgImage: image)
    var filter: CIFilter
    // make it black and white
    filter = CIFilter(name: "CIPhotoEffectNoir")!
    outputImage = applyFilter(filter, for: outputImage)
    // super lower contrast down to get rid of subtle color differences
    // this generally will preserve outline data as well
    filter = CIFilter(name: "CIColorControls")!
    filter.setValue(8.0, forKey: "inputContrast")
    outputImage = applyFilter(filter, for: outputImage)
    // this distinguishes things nicely for edge detection
    // helps prevent finding edges of contiguous blocks
    // while emphasizing edges of that have actual borders
    filter = CIFilter(name: "CIUnsharpMask")!
    filter.setValue(0.9, forKey: "inputIntensity")
    filter.setValue(5.5, forKey: "inputRadius")
    outputImage = applyFilter(filter, for: outputImage)
    // edge detecting with low contrast and unsharp mask
    // gives really nice outlines
    filter = CIFilter(name: "CIEdges")!
    filter.setValue(10.5, forKey: "inputIntensity")
    outputImage = applyFilter(filter, for: outputImage)
    // edges inversts everything basically, so lets un-invert
    filter = CIFilter(name: "CIColorInvert")!
    outputImage = applyFilter(filter, for: outputImage)
    // motion blur horizontal
    // this will ensure that rounded borders and sketchy outlines
    // will still connect to each other for the component finding
    filter = CIFilter(name: "CIMotionBlur")!
    filter.setValue(1.75, forKey: "inputRadius")
    filter.setValue(0.0, forKey: "inputAngle")
    outputImage = applyFilter(filter, for: outputImage)
    // motion blur vertical
    filter = CIFilter(name: "CIMotionBlur")!
    filter.setValue(1.75, forKey: "inputRadius")
    filter.setValue(1.5708, forKey: "inputAngle")
    outputImage = applyFilter(filter, for: outputImage)
    // threshold binarizes the image
    outputImage = applyFilter(ThresholdFilter(), for: outputImage)
    
    // resize
    filter = CIFilter(name: "CILanczosScaleTransform")!
    filter.setValue(1.0 / Double(scale), forKey: "inputScale")
    outputImage = applyFilter(filter, for: outputImage)
    
    // final pass, clarifies resized image back to binary
    outputImage = applyFilter(ThresholdFilterEasy(), for: outputImage)
    
    // write canvas
    let context = CIContext(options: [kCIContextUseSoftwareRenderer: false])
    return context.createCGImage(outputImage, from: outputImage.extent)!
  }
  
  // specialized filter that is best for finding the big area of content
  func filterForVerticalContentFinding(image: CGImage) -> CGImage {
    var outputImage = CIImage(cgImage: image)
    // threshold
    outputImage = applyFilter(ThresholdFilterEasy(), for: outputImage)
    // write canvas
    let context = CIContext(options: [kCIContextUseSoftwareRenderer: false])
    return context.createCGImage(outputImage, from: outputImage.extent)!
  }
  
  // filter that binarizes for individual character finding
  func filterImageForOCRCharacterFinding(image: CGImage) -> CGImage {
    var outputImage = CIImage(cgImage: image)
    var filter: CIFilter
    // noir
    filter = CIFilter(name: "CIPhotoEffectNoir")!
    outputImage = applyFilter(filter, for: outputImage)
    // unsharpen
    filter = CIFilter(name: "CIUnsharpMask")!
    filter.setValue(0.5, forKey: "inputIntensity")
    filter.setValue(2.5, forKey: "inputRadius")
    outputImage = applyFilter(filter, for: outputImage)
    // threshold
    outputImage = applyFilter(ThresholdFilter(), for: outputImage)
    // write
    let context = CIContext(options: [kCIContextUseSoftwareRenderer: false])
    return context.createCGImage(outputImage, from: outputImage.extent)!
  }
  
  // filter just for writing out, optimized for our OCR engine
  func filterImageForOCR(image: CGImage) -> CGImage {
    var outputImage = CIImage(cgImage: image)
    var filter: CIFilter
    // noir
    filter = CIFilter(name: "CIPhotoEffectNoir")!
    outputImage = applyFilter(filter, for: outputImage)
    // threshold
    outputImage = applyFilter(ThresholdBelowFilter(), for: outputImage)
    // write
    let context = CIContext(options: [kCIContextUseSoftwareRenderer: false])
    return context.createCGImage(outputImage, from: outputImage.extent)!
  }
  
}
