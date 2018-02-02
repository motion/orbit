//
//  Extensions.swift
//  SwiftOCR
//
//  Created by Nicolas Camenisch on 21.04.16.
//  Copyright © 2016 Nicolas Camenisch. All rights reserved.
//
import Foundation


public extension Array {
  func pmap<T>(_ transformer: @escaping (Element, Int) -> T) -> [T] {
    var result: [Int: T] = [:]
    guard !self.isEmpty else {
      return []
    }
    if count == 0 {
      return []
    }
    let coreCount = ProcessInfo.processInfo.activeProcessorCount
    let sampleSize = Int(ceil(Double(count) / Double(coreCount)))
    let group = DispatchGroup()
    for index in 0..<sampleSize {
      let startIndex = index * coreCount
      let endIndex = Swift.min((startIndex + (coreCount - 1)), count - 1)
      group.enter()
      DispatchQueue.global().async {
        for index in startIndex...endIndex {
          result[index] = transformer(self[index], index)
        }
        group.leave()
      }
    }
    group.wait()
    return result.keys.sorted().map { result[$0]! }
  }
}


extension Sequence where Iterator.Element: Hashable {
  func unique() -> [Iterator.Element] {
    var seen: [Iterator.Element: Bool] = [:]
    return self.filter { seen.updateValue(true, forKey: $0) == nil }
  }
}

extension Array where Element: Collection, Element.Index == Int, Element.IndexDistance == Int, Element.Iterator.Element: Any {
  func transpose() -> [[Element.Iterator.Element]] {
    if self.isEmpty { return [] }
    
    typealias InnerElement = Element.Iterator.Element
    
    let count = self[0].count
    var out = [[InnerElement]](repeating: [InnerElement](), count: count)
    for outer in self {
      for (index, inner) in outer.enumerated() {
        out[index].append(inner)
      }
    }
    return out
  }
}

extension Array {
  mutating func shuffle() {
    for i in 0 ..< (count - 1) {
      let j = Int(arc4random_uniform(UInt32(count - i))) + i
      self.swapAt(i, j)
    }
  }
}
