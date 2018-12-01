//
//  MouseManager.swift
//  Oracle
//
//  Created by Nathan Weinert on 11/30/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa

class MouseManager {
    
    init() {
        NSEvent.addGlobalMonitorForEvents(matching: [.mouseMoved]) { (event) in
            let mouseLocation = (event.cgEvent?.location)!

            // Send event
            Socket.send(.mouseMoved(x: Int(round(mouseLocation.x)), y: Int(round(mouseLocation.y))))
        }
    }

}
