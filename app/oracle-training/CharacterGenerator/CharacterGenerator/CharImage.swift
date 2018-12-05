//
//  Image.swift
//  CharacterGenerator
//
//  Created by Collin Hundley on 10/30/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation


/// Text-encoded representation of a character, including metadata.
///
/// Format:
/// [charIndex] [charPosition] [charHeight]
/// [pixel] [pixel] [pixel] etc.
struct CharImage {
    
    var char: Char
    let pixels: [Float]
    
    /// String representation of this character.
    /// Contains two lines: one containing metadata, one containing pixel values.
    func toString() -> String {
        // Encode character index to string
        var str = "\(char.charIndex)"
        
        // Encode character line position to string
        str += " \(char.position.rawValue)"
        
        // Encode character height to string
        str += " \(char.height.rawValue)"
        
        // Insert newline before pixel data
        str += "\n"
        
        // Add pixel data to next row
        str += pixels.map({String(format: "%.1f", $0)}).joined(separator: " ")
        
        return str
    }
    
}
