//
//  Line.swift
//  Oracle
//
//  Created by Collin Hundley on 11/28/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation


/// Represents a line of text detected in an image.
class Line {
    
    /// The bounding box containing the line, in absolute coordinates.
    var bounds: CGRect
    
    /// Array of characters contained within the line.
    var characters: [Character]
    
    
    init(bounds: CGRect, characters: [Character]) {
        self.bounds = bounds
        self.characters = characters
    }
    
    
    /// Separates the characters within the line into individual words.
    /// IMPORTANT: All characters MUST be classified before calling this method.
    func words() -> [Word] {
        // Create array of all character bounds
        let charBounds = characters.map({$0.bounds})
        
        // Compute total (summed) spacing between all characters in the line
        var totalSpacing: CGFloat = 0
        for (index, box) in charBounds.enumerated() {
            if index == 0 { continue }
            totalSpacing += (box.minX - charBounds[index - 1].maxX)
        }
        
        if totalSpacing == 0 {
            // Zero or one characters (zero shouldn't be possible)
            if characters.isEmpty {
                return []
            } else {
                // Single-character word
                return [Word(bounds: characters[0].bounds, string: characters[0].classification ?? "")]
            }
        }
        
        // Compute average spacing between characters
        let avgSpacing = totalSpacing / CGFloat(charBounds.count - 1)
        
        // Loop through characters and group together into words
        var allWords = [Word]()
        var currentWord = Word(bounds: .zero, string: "")
        for (index, charBox) in charBounds.enumerated() {
            let box = charBox

            if index == 0 {
                // First character; start with char's box and classification
                currentWord.bounds = box
                currentWord.string = characters[0].classification ?? ""
                continue
            } else if index == charBounds.count - 1 {
                // Last character in the line; make sure we add current word to the array
                allWords.append(currentWord)
            }
            
            // Calculate spacing between this character and the previous character
            let currentSpacing = (box.minX - charBounds[index - 1].maxX)
            
            // If spacing is greater than avg + 50%, consider this a new word
            if currentSpacing > (avgSpacing * 1.5) {
                // Found a gap; start a new word
                allWords.append(currentWord)
                currentWord = Word(bounds: box, string: characters[index].classification ?? "")
                continue
            } else {
                // This character is probably part of the existing word;
                // append letter and expand bounds to include it
                currentWord.bounds = currentWord.bounds.union(box)
                currentWord.string += characters[index].classification ?? ""
            }
        }
        
        // Return words
        return allWords
    }
    
}


/// A word, contained within a line, detected in an image.
class Word {
    
    /// The bounding box containing the word, in absolute coordinates.
    var bounds: CGRect
    
    /// The word's string value.
    /// This is the combined classifications of each character contained within the word.
    var string: String
    
    
    init(bounds: CGRect, string: String) {
        self.bounds = bounds
        self.string = string
    }
    
}


/// A single character, contained within a word within a line, detected in an image.
class Character {
    
    /// The bounding box containing the character, in absolute coordinates.
    var bounds: CGRect
    
    /// Top OCR result for this character.
    /// This is assigned by the neural network later, after OCR is performed.
    var classification: String?
    
    
    init(bounds: CGRect) {
        self.bounds = bounds
    }
    
    
    /// The bounds of the character, expanded vertically to fill the full height of its containing line.
    /// This is useful for determining the "true" size of a character, e.g. identifying upper- vs lowercase letters.
    func lineHeightBounds(with lineBounds: CGRect) -> CGRect {
        return CGRect(x: bounds.minX,
                      y: lineBounds.minY,
                      width: bounds.width,
                      height: lineBounds.height)
    }
    
}
