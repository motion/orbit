//
//  Log.swift
//  Oracle
//
//  Created by Collin Hundley on 11/29/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Foundation
import os.log


/// Centralized logging to debug window AND console.
class Log {
    
    /// Dont' allow other instances
    private init() {}
    
    static func debug(_ str: String) {
        if shouldLogDebug {
            os_log("%@", type: OSLogType.debug, str)
        }
    }
    
    static func info(_ str: String) {
         os_log("%@", type: OSLogType.info, str)
    }
    
    static func error(_ str: String) {
        os_log("%@", type: OSLogType.error, str)
    }
    
}
