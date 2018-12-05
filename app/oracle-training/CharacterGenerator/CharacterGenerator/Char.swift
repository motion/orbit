//
//  Characters.swift
//  CharacterGenerator
//
//  Created by Collin Hundley on 10/30/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation



// ADD NEW SUPPORTED CHARACTERS HERE **AND** TO `allChars` BELOW.
// Also must update Keras model training script and anywhere else chars are used (OCR app).
let allCharacters = Array("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?;:@[]'\"()-#$*").map({String($0)})


/// Container for supported characters + metadata.
struct Char {
    
    /// Typical character position on line.
    enum Position: Int {
        case baseline
        case middle
        case top
    }
    
    /// Typical character height.
    enum Height: Int {
        /// Only used for small punctuation (. , ' " etc).
        case small
        /// Half-height lowercase letters and some punctuation (#, @, etc).
        case medium
        /// Capital letters, tall lowercase letters, numbers and some punctuation (!, ?, ], etc).
        case tall
    }
    
    let char: String
    var position: Position
    var height: Height
    
    /// Character's index in master array.
    var charIndex: Int {
        return allCharacters.firstIndex(of: char)!
    }
    
    
    /// Randomizes the character's `position` metadeta with the given probability.
    mutating func randomizePosition(probability: Double) {
        guard rollDice(probability) else { return }
        
        switch position {
        case .baseline:
            position = .middle
        case .middle:
            if rollDice(0.5) {
                position = .baseline
            } else {
                position = .top
            }
        case .top:
            position = .middle
        }
    }
    
    
    /// Randomizes the character's `height` metadeta with the given probability.
    mutating func randomizeHeight(probability: Double) {
        guard rollDice(probability) else { return }
        
        switch height {
        case .small:
            height = .medium
        case .medium:
            if rollDice(0.5) {
                height = .small
            } else {
                height = .tall
            }
        case .tall:
            height = .medium
        }
    }
    
    
    /// "Rolls dice" with given probability.
    /// Ex: Probability `0.1` will return `true` approx. 1 in 10 times.
    private func rollDice(_ probability: Double) -> Bool {
        let size = Int(round(1.0 / probability))
        let rand = Int.random(in: 0..<size)
        return rand == 0
    }
    
    
}


// ALSO UPDATE THIS ARRAY WITH NEW CHARS + METADATA:
/// All supported characters + metadata.
let allChars: [Char] = [
    Char(char: "a", position: .baseline, height: .medium),
    Char(char: "b", position: .baseline, height: .tall),
    Char(char: "c", position: .baseline, height: .medium),
    Char(char: "d", position: .baseline, height: .tall),
    Char(char: "e", position: .baseline, height: .medium),
    Char(char: "f", position: .baseline, height: .tall),
    Char(char: "g", position: .baseline, height: .medium),
    Char(char: "h", position: .baseline, height: .tall),
    Char(char: "i", position: .baseline, height: .tall),
    Char(char: "j", position: .baseline, height: .medium),
    Char(char: "k", position: .baseline, height: .tall),
    Char(char: "l", position: .baseline, height: .tall),
    Char(char: "m", position: .baseline, height: .medium),
    Char(char: "n", position: .baseline, height: .medium),
    Char(char: "o", position: .baseline, height: .medium),
    Char(char: "p", position: .baseline, height: .medium),
    Char(char: "q", position: .baseline, height: .medium),
    Char(char: "r", position: .baseline, height: .medium),
    Char(char: "s", position: .baseline, height: .medium),
    Char(char: "t", position: .baseline, height: .tall),
    Char(char: "u", position: .baseline, height: .medium),
    Char(char: "v", position: .baseline, height: .medium),
    Char(char: "w", position: .baseline, height: .medium),
    Char(char: "x", position: .baseline, height: .medium),
    Char(char: "y", position: .baseline, height: .medium),
    Char(char: "z", position: .baseline, height: .medium),
    Char(char: "A", position: .baseline, height: .tall),
    Char(char: "B", position: .baseline, height: .tall),
    Char(char: "C", position: .baseline, height: .tall),
    Char(char: "D", position: .baseline, height: .tall),
    Char(char: "E", position: .baseline, height: .tall),
    Char(char: "F", position: .baseline, height: .tall),
    Char(char: "G", position: .baseline, height: .tall),
    Char(char: "H", position: .baseline, height: .tall),
    Char(char: "I", position: .baseline, height: .tall),
    Char(char: "J", position: .baseline, height: .tall),
    Char(char: "K", position: .baseline, height: .tall),
    Char(char: "L", position: .baseline, height: .tall),
    Char(char: "M", position: .baseline, height: .tall),
    Char(char: "N", position: .baseline, height: .tall),
    Char(char: "O", position: .baseline, height: .tall),
    Char(char: "P", position: .baseline, height: .tall),
    Char(char: "Q", position: .baseline, height: .tall),
    Char(char: "R", position: .baseline, height: .tall),
    Char(char: "S", position: .baseline, height: .tall),
    Char(char: "T", position: .baseline, height: .tall),
    Char(char: "U", position: .baseline, height: .tall),
    Char(char: "V", position: .baseline, height: .tall),
    Char(char: "W", position: .baseline, height: .tall),
    Char(char: "X", position: .baseline, height: .tall),
    Char(char: "Y", position: .baseline, height: .tall),
    Char(char: "Z", position: .baseline, height: .tall),
    Char(char: "0", position: .baseline, height: .tall),
    Char(char: "1", position: .baseline, height: .tall),
    Char(char: "2", position: .baseline, height: .tall),
    Char(char: "3", position: .baseline, height: .tall),
    Char(char: "4", position: .baseline, height: .tall),
    Char(char: "5", position: .baseline, height: .tall),
    Char(char: "6", position: .baseline, height: .tall),
    Char(char: "7", position: .baseline, height: .tall),
    Char(char: "8", position: .baseline, height: .tall),
    Char(char: "9", position: .baseline, height: .tall),
    Char(char: ".", position: .baseline, height: .small),
    Char(char: ",", position: .baseline, height: .small),
    Char(char: "!", position: .baseline, height: .tall),
    Char(char: "?", position: .baseline, height: .tall),
    Char(char: ";", position: .baseline, height: .medium),
    Char(char: ":", position: .baseline, height: .medium),
    Char(char: "@", position: .baseline, height: .medium),
    Char(char: "[", position: .baseline, height: .tall),
    Char(char: "]", position: .baseline, height: .tall),
    Char(char: "'", position: .top, height: .small),
    Char(char: "\"", position: .top, height: .small),
    Char(char: "(", position: .baseline, height: .tall),
    Char(char: ")", position: .baseline, height: .tall),
    Char(char: "-", position: .middle, height: .medium),
    Char(char: "#", position: .baseline, height: .medium),
    Char(char: "$", position: .baseline, height: .tall),
    Char(char: "*", position: .middle, height: .small)
]
