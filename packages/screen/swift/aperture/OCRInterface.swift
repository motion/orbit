import Foundation

/// A simple demonstration interface to the python module
@objc public protocol OCRInterface {
  static func createInstance() -> OCRInterface
  func ocrCharacters() -> [String]
}

/// A simple class for access to an instance of the python interface
class Bridge {
  static private var instance: OCRInterface?
  
  static func sharedInstance() -> OCRInterface {
    return instance!
  }
  static func setSharedInstance(to: OCRInterface?) {
    instance = to
  }
}
