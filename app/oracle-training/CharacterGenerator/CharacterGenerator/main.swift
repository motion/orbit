//
//  main.swift
//  CharacterGenerator
//
//  Created by Collin Hundley on 10/29/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa
import CoreGraphics
import Vision



/* ---------- README ----------

This app generates training data for the Oracle OCR model.
 
One file is generated: training-data.txt
 
Characters consume two lines each: the first line contains metadata,
 and the second line contains pixel data (where 0 is white and 1 is black).
 Metadata format: [character index] [position] [height],
 representing the index/rawValues found in Char.swift.
 
Supported characters may be updated in `Char.swift`.
Supported fonts may be updated in `Fonts.swift`.

Modify constants below to suit your system's needs.

---------------------------- */



/* ---------- CONSTANTS ---------- */

/// Change this to your own output directory (anywhere you want).
/// Make sure the directory exists before running!
let outputDir = "/Users/Collin/Documents/Orbit/CharacterGenerator/Output/"

/// Set this to `true` if you want to see the images produced in PNG format.
/// WARNING: It's a lot of images and takes a while.
/// Filename format: [fontName]-[fontSize]-[char].png, where
/// fontName and char are the indices in their corresponding arrays in Fonts.swift and Char.swift.
let saveImages = false

/* ------------------------------- */



// MARK: Storage for stuff we need

/// Storage for output images.
var allImages = [CharImage]()


// MARK: Main loop

// Iterate through every font
for fontNameIndex in 0..<fontNames.count {
    // Log progress
    print("Processing font \(fontNameIndex + 1) of \(fontNames.count)")

    // Iterate through every size
    for fontSizeIndex in 0..<fontSizes.count {
        // Create font based on name and size
        guard let font = NSFont(name: fontNames[fontNameIndex], size: fontSizes[fontSizeIndex]) else {
            print("WARNING: Font not available on this system: \(fontNames[fontNameIndex])")
            print("You can download this font online and install it using FontBook. Skipping for now.")
            continue
        }

        // Iterate through every character
        for charIndex in 0..<allChars.count {
            // Create NSAttributed string containing character
            let attrString = NSAttributedString(string: allChars[charIndex].char, attributes: [
                NSAttributedString.Key.font : font,
                NSAttributedString.Key.foregroundColor : NSColor.black
                ])
            let size = attrString.size()
            // Size may be fractional pixels, so here we always round up to avoid clipping
            // Note: We trim some pixels from the height, because NSAttributedString adds extra whitespace above characters.
            // It seems to be 1pt for every 7pt font size, and somewhat consistent between fonts
            let topTrim = fontSizes[fontSizeIndex] / 7
            let strRect = CGRect(x: 0, y: 0, width: ceil(size.width), height: ceil(size.height) - topTrim)

            // Create a new CGContext
            let context = CGContext(data: nil,
                                    width: Int(strRect.width), height: Int(strRect.height),
                                    bitsPerComponent: 8, bytesPerRow: Int(strRect.width) * 4,
                                    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!

            // Fill context background with white
            context.setFillColor(CGColor.white)
            context.fill(strRect)

            // Create an NSGraphicsContext with our CGContext
            // We need this to draw the attributed string
            NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)

            // Draw character in context
            attrString.draw(at: .zero)

            // Extract image from CGContext
            let cgImage = context.makeImage()!
            
            // Resize to 28x28
            let resized = resize(cgImage, to: CGSize(width: 28, height: 28))

            // Save PNG
            // Filename format: [fontName]-[fontSize]-[char].png
            if saveImages {
                let filename = "\(fontNameIndex)-\(fontSizes[fontSizeIndex])-\(charIndex).png"
                let bitmap = NSBitmapImageRep(cgImage: resized)
                let png = bitmap.representation(using: .png, properties: [:])
                try! png?.write(to: URL(fileURLWithPath: outputDir + filename))
            }

            // Convert image to pixel data (Float range 0-1) and add to array
            let pixelData = pixels(from: resized, threshold: false)
            let charImage = CharImage(char: allChars[charIndex], pixels: pixelData)
            allImages.append(charImage)
        }
    }
}



// Shuffle all images
//print("Shuffling dataset...")
//allImages.shuffle()

// Randomize position and height values for all images with low probability (where applicable).
// This introduces some "noise" into the dataset, as well as accounts
// for fonts where tall characters render medium-size, and vice versa.
print("Randomizing metadata...")
for i in 0..<allImages.count {
    allImages[i].char.randomizePosition(probability: 0.1)
    allImages[i].char.randomizeHeight(probability: 0.15)
}

// Convert image set to String format
print("Generating txt file...")
let trainingStr = allImages.map {($0.toString())}.joined(separator: "\n\n")

// Save to files
let trainingURL = URL(fileURLWithPath: outputDir + "training-data.txt")
try! trainingStr.write(to: trainingURL, atomically: true, encoding: .utf8)

print("Done")

