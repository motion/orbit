//
//  CharacterCache.swift
//  Oracle
//
//  Created by Collin Hundley on 11/28/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation
import AVFoundation


/// Central character cache (used to speed up OCR).
class CharacterCache {
    
    /// Shared instance.
    static let shared = CharacterCache()
    
    /// Cache storage.
    /// Here we also store the time the item was added, so we can perform garbage collection when needed.
    /// Key: Character outline
    /// Value: (Classification, time added)
    fileprivate var cache = [[Int] : (String, DispatchTime)]()
    /// When the cache reaches this size, we remove old entries until it reaches `cacheMinSize`.
    fileprivate let cacheMaxSize = 4000
    /// When we thin the cache, we reduce it down to this size.
    fileprivate let cacheMinSize = 2000
    
    /// Container for move directions to follow while tracing outlines.
    let moves = Moves()
    
    
    private init() {}
    
}


/// Container for move directions to follow while tracing character outlines.
class Moves {
    
    public var clockwise: [Int : [Int : [[Int]]]]
    public var px = 1
    
    init() {
        // corners and sides
        let down = [0, px]
        let downright = [px, px]
        let left = [-px, 0]
        let upleft = [-px, -px]
        let up = [0, -px]
        let upright = [px, -px]
        let right = [px, 0]
        let downleft = [-px, px]

        // clockwise sequences
        let fromupleft = [
            //      down,
            //  diag_downdownleft,
            downleft,
            left,
            // diag_upleftleft,
            upleft,
            // diag_upupleft,
            up,
            // diag_upupright,
            upright,
            // diag_uprightright,
            right,
            // diag_downrightright,
            downright,
            ]
        let fromleft = [
            //      downright,
            //  diag_downdownright,
            down,
            // diag_downdownleft,
            downleft,
            // diag_downleftleft,
            left,
            // diag_upleftleft,
            upleft,
            // diag_upupleft,
            up,
            // diag_upupright,
            upright,
            // diag_uprightright,
            right,
            ]
        let fromdownleft = [
            //      right,
            //  diag_downrightright,
            downright,
            // diag_downdownright,
            down,
            // diag_downdownleft,
            downleft,
            // diag_downleftleft,
            left,
            // diag_upleftleft,
            upleft,
            // diag_upupleft,
            up,
            // diag_upupright,
            upright,
            ]
        let fromup = [
            //      downleft,
            //  diag_downleftleft,
            left,
            // diag_upleftleft,
            upleft,
            // diag_upupleft,
            up,
            // diag_upupright,
            upright,
            // diag_uprightright,
            right,
            // diag_downrightright,
            downright,
            // diag_downdownright,
            down,
            ]
        let fromdown = [
            //      upright,
            //  diag_uprightright,
            right,
            // diag_downrightright,
            downright,
            // diag_downdownright,
            down,
            // diag_downdownleft,
            downleft,
            // diag_downleftleft,
            left,
            // diag_upleftleft,
            upleft,
            // diag_upupleft,
            up,
            ]
        let fromupright = [
            //      left,
            //  diag_upleftleft,
            upleft,
            // diag_upupleft,
            up,
            // diag_upupright,
            upright,
            // diag_uprightright,
            right,
            // diag_downrightright,
            downright,
            // diag_downdownright,
            down,
            // diag_downdownleft,
            downleft,
            ]
        let fromright = [
            //      upleft,
            //  diag_upupleft,
            up,
            // diag_upupright,
            upright,
            // diag_uprightright,
            right,
            // diag_downrightright,
            downright,
            // diag_downdownright,
            down,
            // diag_downdownleft,
            downleft,
            // diag_downleftleft,
            left,
            ]
        let fromdownright = [
            //      up,
            //  diag_upupright,
            upright,
            // diag_uprightright,
            right,
            // diag_downrightright,
            downright,
            // diag_downdownright,
            down,
            // diag_downdownleft,
            downleft,
            // diag_downleftleft,
            left,
            // diag_upleftleft,
            upleft,
            ]
        
        clockwise = [
            -px: [
                -px: fromupleft,
                0: fromleft,
                px: fromdownleft
            ],
            0: [
                -px: fromup,
                px: fromdown,
            ],
            px: [
                -px: fromupright,
                0: fromright,
                px: fromdownright
            ]
        ]
    }
}


// MARK: Public API

extension CharacterCache {
    
    /// Checks if the cache contains the given character outline,
    /// returning the character if so.
    /// Must NOT be called from the main queue!
    func cachedCharacter(matching outline: [Int]) -> String? {
        // Synchronize access to cache on main queue
        var result: String?
        DispatchQueue.main.sync {
            result = cache[outline]?.0
        }
        return result
    }
    
    
    /// Adds a new outline+character combo to the cache.
    /// Must NOT be called from the main queue!
    func addToCache(outline: [Int], character: String) {
        // Synchronize access to cache on main queue
        DispatchQueue.main.sync {
            let time = DispatchTime.now()
            cache[outline] = (character, time)
        }
        
        // Check cache size and thin if needed
        // We do this asynchronously so we don't block other operations
        DispatchQueue.main.async {
            // We only care once the cache reaches the max size
            if self.cache.count >= self.cacheMaxSize {
                // Max size reached; sort all cache elements by time added
                let times = self.cache.map({$0.value.1}).sorted()
                // Safety
                guard times.count >= self.cacheMinSize else { return }
                // Determine cutoff time
                let cutoff = times[self.cacheMinSize - 1]
                // Filter all cache results older than cutoff time
                self.cache = self.cache.filter({$0.value.1 < cutoff})
            }
        }
    }
    
    
    /// Clears the entire contents of the cache.
    func flush() {
        // Syncrhonize access to cache on main queue
        DispatchQueue.main.async {
            self.cache.removeAll()
        }
    }
    
}


// MARK: Outline tracing

extension CharacterCache {
    
    /// Traces the outline of the character contained within the given pixel buffer region.
    ///
    /// - Parameters:
    ///   - pixelBuffer: The pixel buffer.
    ///   - charBounds: The bounds containing the character (in coordinates relative to the provided buffer).
    ///   - lineHeight: The height of the line containing the character.
    ///   - maxMoves: The maximum number of moves to attempt before timing out.
    ///   - initialMove: The first direction to move while looking for an outline.
    ///   - findHangers: If `true`, the outliner will also search for hangers above the character.
    ///   - percentDownLine: The percent this character's bounds begins down its containing line.
    /// - Returns: An array of integers representing this character's unique outline.
    func traceOutline(baseAddress: UnsafeMutableRawPointer, bytesPerRow: Int, numRows: Int, charBounds: CGRect, shouldInvert: Bool, lineHeight: Int, maxMoves: Int, initialMove: [Int], findHangers: Bool, percentDownLine: Float) -> (outline: [Int], bounds: CGRect)? {
        let buffer = baseAddress.assumingMemoryBound(to: UInt8.self)
        let isBlackIfUnder: UInt8 = 128
        
        // Find starting point (left-most black pixel in image)
        guard let (startX, startY) = findStartingPoint(baseAddress: baseAddress, bytesPerRow: bytesPerRow, numRows: numRows, bounds: charBounds, inverted: shouldInvert) else {
            return nil
        }
        
        let exhaust = lineHeight * 6 // distance to go without finding new bound before finishing character
        var visited = Dictionary<Int, Bool?>() // for preventing crossing over at thin interections
        var topLeftBound = [startX, startY]
        var bottomRightBound = [startX, startY]
        var lastMove = initialMove // start move
        var outline = [Int]()
        var iteration = 0
        var x = startX
        var y = startY - moves.px // subtracting here fixes bugs for real
        var curTry = 0
        var curPos = 0
        var foundEnd = false
        let clockwise = moves.clockwise
        let backwardsRange = stride(from: 1, to: 7, by: 2) // could increase potenitally
        var rightMoves = 0 // to detect if ran into underline and are moving right a ton
        
        while !foundEnd {
            iteration += 1
            if iteration > maxMoves {
                if !findHangers {
                    return nil
                }
                return nil
            }
            // every lineHeight/10 moves, record outline
            if iteration % Int(ceil(Double(lineHeight) / 20)) == 0 {
                outline += [lastMove[0] + 4, lastMove[1] + 4]
            }
            curPos = y * bytesPerRow + x
            // remember weve been here
            visited[curPos] = true
            curTry += 1
            if curTry > exhaust {
                foundEnd = true
                break
            }
            var success = false
            let fwdMoves = clockwise[lastMove[0]]![lastMove[1]]!
            
            for (index, attempt) in fwdMoves.enumerated() {
                let next = curPos + attempt[0] + attempt[1] * bytesPerRow
                guard next < bytesPerRow * numRows else { continue }
                if curTry > 10 && x == startX && y == startY { // found end!
                    foundEnd = true
                    break
                }
                // not black
                if shouldInvert {
                    if buffer[next] < isBlackIfUnder { continue }
                } else {
                    if buffer[next] >= isBlackIfUnder { continue }
                }
                
                // already visited
                if visited[next] != nil { continue }
                // ensure backwards x pixels are also black
                // avoids small connections
                for x in backwardsRange {
                    let nextAttempt = fwdMoves[(index + x) % fwdMoves.count]
                    let nextPixel = curPos + nextAttempt[0] + nextAttempt[1] * bytesPerRow
                    guard nextPixel < bytesPerRow * numRows else { continue }
                    if shouldInvert {
                        if buffer[nextPixel] < isBlackIfUnder { continue }
                    } else {
                        if buffer[nextPixel] >= isBlackIfUnder { continue }
                    }
                }
                // prevent underlines from being found by tracking right moves
                if attempt[0] == moves.px && attempt[1] == 0 {
                    rightMoves += 1
                } else {
                    rightMoves = 0
                }
                if rightMoves > exhaust { // found underline
//                    print("breaking due to right")
                    break
                }
                // found a valid next move≥
                success = true
                // update pos
                x += attempt[0]
                y += attempt[1]
                // update bounds
                let newEndX = x > bottomRightBound[0]
                let newStartX = x < topLeftBound[0]
                let newStartY = y < topLeftBound[1]
                let newEndY = y > bottomRightBound[1]
                // reset curTry if we found a new bound
                if newEndX { curTry = 0; bottomRightBound[0] = x }
                else if newStartX { curTry = 0; topLeftBound[0] = x }
                if newStartY { curTry = 0; topLeftBound[1] = y }
                else if newEndY { curTry = 0; bottomRightBound[1] = y }
                // update move
                if attempt.count == 3 {
                    if attempt[2] == 1 { // big x
                        lastMove = [attempt[0] / 2, attempt[1]]
                    } else { // big y
                        lastMove = [attempt[0], attempt[1] / 2]
                    }
                } else {
                    lastMove = attempt
                }
                break
            }
            if !success {
                break
            }
        }
        
        // shared variables for hanger finding
        let minX = topLeftBound[0]
        var width = bottomRightBound[0] - topLeftBound[0] + 1
        var minY = topLeftBound[1]
        var height = bottomRightBound[1] - topLeftBound[1] + 1
        
        // now we have our character, lets see if theres a
        // blob above/below, to get i's and j's and ?'s
        if findHangers {
            let centerX = topLeftBound[0] + (width / 2)
            let maxDownPx = Int((1.0 - percentDownLine) * Float(lineHeight) / 2.2) // pxs left in line downwards
            let maxUpPx = Int(percentDownLine * Float(lineHeight) / 2.2) // pxs left in line upwards
            let maxY = bottomRightBound[1]
            if maxUpPx > 2 {
                // go up
                for y in 1...maxUpPx {
                    if (shouldInvert && buffer[(minY - y) * bytesPerRow + centerX] > isBlackIfUnder) || (!shouldInvert && buffer[(minY - y) * bytesPerRow + centerX] < isBlackIfUnder) {
                        let subBounds = CGRect(x: centerX, y: minY - y, width: Int(charBounds.width), height: Int(charBounds.height))
                        if let (subOutline, subBounds) = traceOutline(baseAddress: baseAddress,
                                                                      bytesPerRow: bytesPerRow,
                                                                      numRows: numRows,
                                                                      charBounds: subBounds,
                                                                      shouldInvert: shouldInvert,
                                                                      lineHeight: lineHeight,
                                                                      maxMoves: lineHeight * 10,
                                                                      initialMove: [0, -moves.px],
                                                                      findHangers: false,
                                                                      percentDownLine: percentDownLine) {
                            if Int(subBounds.width * subBounds.height) > maxUpPx * maxUpPx * 4 {
//                                print("hanger above area big")
                                break
                            }
                            if Int(subBounds.height) > maxUpPx * 4 {
//                                print("hanger above tall")
                                break
                            }
                            height += minY - Int(subBounds.minY)
                            minY = Int(subBounds.minY)
                            let widthWithChar = Int(subBounds.minX + subBounds.width) - minX
                            width = max(widthWithChar, width)
                            outline += subOutline
                            break
                        }
                    }
                }
            }
            
            if maxDownPx > 1 {
                // go down
                for y in 1...maxDownPx {
                    let bufferIdx = (maxY + y) * bytesPerRow + centerX
                    guard bufferIdx < numRows * bytesPerRow else  { continue }
                    if (shouldInvert && buffer[(maxY + y) * bytesPerRow + centerX] > isBlackIfUnder) || (!shouldInvert && buffer[(maxY + y) * bytesPerRow + centerX] < isBlackIfUnder) {
                        let subBounds = CGRect(x: centerX, y: maxY + y, width: Int(charBounds.width), height: Int(charBounds.height))
                        if let (subOutline, subBounds) = traceOutline(baseAddress: baseAddress,
                                                                      bytesPerRow: bytesPerRow,
                                                                      numRows: numRows,
                                                                      charBounds: subBounds,
                                                                      shouldInvert: shouldInvert,
                                                                      lineHeight: lineHeight,
                                                                      maxMoves: lineHeight * 10,
                                                                      initialMove: [0, -moves.px],
                                                                      findHangers: false,
                                                                      percentDownLine: percentDownLine) {
                            if Int(subBounds.width * subBounds.height) > maxDownPx * maxDownPx * 4 { break }
                            if Int(subBounds.height) > maxDownPx * 4 { break }
                            height += Int(subBounds.height) + (Int(subBounds.minY) - maxY)
                            let widthWithChar = Int(subBounds.minX + subBounds.width) - minX
                            width = max(widthWithChar, width)
                            outline += subOutline
                            break
                        }
                    }
                }
            }
        }
        
        // Note: We only return these bounds because they're used for finding hangers
        let bounds = CGRect(x: minX, y: minY, width: width, height: height)
        return (outline, bounds)
    }
    
    
    /// Finds the coordinate of the left-most black pixel within the given bounds.
    func findStartingPoint(baseAddress: UnsafeMutableRawPointer, bytesPerRow: Int, numRows: Int, bounds: CGRect, inverted: Bool) -> (x: Int, y: Int)? {
        let buffer = baseAddress.assumingMemoryBound(to: UInt8.self)
        let bufferStartIdx = Int(bounds.minY) * bytesPerRow + Int(bounds.minX)
        
        // Any pixel under this value (or over, if inverted) is considered black
        let blackThreshold = 128
        
        // Find position of left-most black pixel
        var startX, startY: Int?
        for col in 0..<Int(bounds.width) {
            for row in 0..<Int(bounds.height) {
                let bufferIdx = bufferStartIdx + row * bytesPerRow + col
                guard bufferIdx < numRows * bytesPerRow else {
                    return nil
                }
                if inverted && buffer[bufferIdx] > blackThreshold {
                    startX = col + Int(bounds.minX)
                    startY = row + Int(bounds.minY)
                } else if !inverted && buffer[bufferIdx] < blackThreshold {
                    startX = col + Int(bounds.minX)
                    startY = row + Int(bounds.minY)
                }
            }
        }
        
        guard let x = startX, let y = startY else {
            return nil
        }
        
        return (x, y)
    }
    
}
