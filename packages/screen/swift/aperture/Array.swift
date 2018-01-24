import Foundation

public extension Array {
  func pmap<T>(transformer: @escaping (Element, Int) -> T) -> [T] {
    var result: [Int: [T]] = [:]
    guard !self.isEmpty else {
      return []
    }
    let coreCount = ProcessInfo.processInfo.activeProcessorCount
    let sampleSize = Int(ceil(Double(count) / Double(coreCount)))
    let group = DispatchGroup()
    for index in 0..<sampleSize {
      let startIndex = index * coreCount
      let endIndex = Swift.min((startIndex + (coreCount - 1)), count - 1)
      result[startIndex] = []
      group.enter()
      DispatchQueue.global().async {
        for index in startIndex...endIndex {
          result[startIndex]?.append(transformer(self[index], index))
        }
        group.leave()
      }
    }
    group.wait()
    return result.sorted(by: { $0.0 < $1.0 }).flatMap { $0.1 }
  }
}
