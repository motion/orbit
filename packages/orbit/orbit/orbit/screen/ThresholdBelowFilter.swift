import AppKit

class ThresholdBelowFilter: CIFilter {
  @objc dynamic var inputImage : CIImage?
  var threshold: CGFloat = 0.2
  
  var colorKernel = CIColorKernel(source:
    "kernel vec4 color(__sample pixel, float threshold)" +
      "{" +
      "    float luma = dot(pixel.rgb, vec3(0.2126, 0.7152, 0.0722));" +
      "    return (luma < threshold) ? pixel : vec4(1.0, 1.0, 1.0, 1.0);" +
    "}"
  )
  
  override var outputImage: CIImage!
  {
    let inputImage = self.inputImage!
    let colorKernel = self.colorKernel!
    let extent = inputImage.extent
    let arguments = [inputImage, threshold] as [Any]
    return colorKernel.apply(extent: extent, arguments: arguments)
  }
}

