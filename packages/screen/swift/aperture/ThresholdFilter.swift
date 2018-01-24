import AppKit

class ThresholdFilter: CIFilter {
  @objc dynamic var inputImage : CIImage?
  // lower = more whitespace
  // higher = bolder characters
  var threshold: CGFloat = 0.7
  
  var colorKernel = CIColorKernel(source:
    "kernel vec4 color(__sample pixel, float threshold)" +
      "{" +
      "    float luma = dot(pixel.rgb, vec3(0.2126, 0.7152, 0.0722));" +
      //      "    float threshold = smoothstep(inputEdgeO, inputEdge1, luma);" +
      "    return (luma > threshold) ? vec4(1.0, 1.0, 1.0, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);" +
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


class ThresholdFilterEasy: CIFilter {
  @objc dynamic var inputImage : CIImage?
  // lower = more whitespace
  // higher = bolder characters
  var threshold: CGFloat = 0.3
  
  var colorKernel = CIColorKernel(source:
    "kernel vec4 color(__sample pixel, float threshold)" +
      "{" +
      "    float luma = dot(pixel.rgb, vec3(0.2126, 0.7152, 0.0722));" +
      //      "    float threshold = smoothstep(inputEdgeO, inputEdge1, luma);" +
      "    return (luma > threshold) ? vec4(1.0, 1.0, 1.0, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);" +
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
