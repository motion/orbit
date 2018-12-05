//
//  Fonts.swift
//  CharacterGenerator
//
//  Created by Collin Hundley on 10/30/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation
import Cocoa


// Arial
// Times New Roman
// Courier
// Courier New
// Helvetica
// Helvetica Neue
// Comic Sans
// Tahoma
// Verdana
// Georgia
// Geneva
// Copperplate
// Futura
// Lato
// Gotham


// Font sizes rendered for training/validation data.
// Note: Most fonts scale proportionally, making multiple sizes redundant.
// However, some fonts render slightly differently at larger sizes, so we
// cover our bases here.
let fontSizes: [CGFloat] = [14, 28, 112]


// List of fonts used for training/validation data.
// Add more here if desired.
let fontNames: [String] = [
    "Arial",
    "Arial-BoldMT",
    "Arial-ItalicMT",
    
    "TimesNewRomanPSMT",
    "TimesNewRomanPS-BoldMT",
    "TimesNewRomanPS-ItalicMT",
    "TimesNewRomanPS-BoldItalicMT",
    
    "Courier",
    
    "CourierNewPSMT",
    "CourierNewPS-BoldMT",
    "CourierNewPS-ItalicMT",
    "CourierNewPS-BoldItalicMT",
    
    "Helvetica",
    "Helvetica-Light",
    "Helvetica-Bold",
    
    "HelveticaNeue",
    "HelveticaNeue-Light",
    "HelveticaNeue-Bold",
    "HelveticaNeue-Italic",
    
    "ComicSansMS",
    
    "Tahoma",
    "Tahoma-Bold",
    
    "Verdana",
    "Verdana-Bold",
    "Verdana-Italic",
    "Verdana-BoldItalic",
    
    "Georgia",
    "Georgia-Bold",
    "Georgia-Italic",
    "Georgia-BoldItalic",
    
    "Geneva",
    
    "Copperplate",
    "Copperplate-Light",
    "Copperplate-Bold",
    
    "Futura",
    "Futura-Medium",
    "Futura-Bold",
    "Futura-MediumItalic",
    "Futura-CondensedMedium",
    "Futura-CondensedExtraBold",
    
    "Lato",
    "Lato-Light",
    
    "Gotham",
    "Gotham-Bold",
    "Gotham-BookItalic",
    "Gotham-Light",
    "Gotham-Thin",
    "Gotham-ThinItalic",
]
