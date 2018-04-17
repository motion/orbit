//
//  Extensions.swift
//  SwiftOCR
//
//  Created by Nicolas Camenisch on 21.04.16.
//  Copyright © 2016 Nicolas Camenisch. All rights reserved.
//
import Foundation

extension String {
  subscript (bounds: CountableClosedRange<Int>) -> String {
    let start = index(startIndex, offsetBy: bounds.lowerBound)
    let end = index(startIndex, offsetBy: bounds.upperBound)
    return String(self[start...end])
  }
  
  subscript (bounds: CountableRange<Int>) -> String {
    let start = index(startIndex, offsetBy: bounds.lowerBound)
    let end = index(startIndex, offsetBy: bounds.upperBound)
    return String(self[start..<end])
  }
}

public extension Array {
  func pmap<T>(_ transformer: @escaping (Element, Int) -> T) -> [T] {
    var result: [Int: T] = [:]
    guard !self.isEmpty else {
      return []
    }
    if count == 0 {
      return []
    }
    if count == 1 {
      return self.enumerated().map { transformer($0.element, $0.offset) }
    }
    let cores = Swift.max(1, ProcessInfo.processInfo.activeProcessorCount / 2)
    let sampleSize = Int(ceil(Double(count) / Double(cores)))
    let group = DispatchGroup()
    for index in 0..<sampleSize {
      let startIndex = index * cores
      let endIndex = Swift.min((startIndex + (cores - 1)), count - 1)
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
