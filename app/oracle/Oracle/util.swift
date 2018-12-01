//
//  util.swift
//  Oracle
//
//  Created by Nathan Weinert on 11/30/18.
//  Copyright © 2018 Orbit. All rights reserved.
//

import Cocoa

extension TimeInterval {
    func hasPassed(since: TimeInterval) -> Bool {
        return Date().timeIntervalSinceReferenceDate - self > since
    }
}

func throttle<T>(delay: TimeInterval, queue: DispatchQueue = .main, action: @escaping ((T) -> Void)) -> (T) -> Void {
    var currentWorkItem: DispatchWorkItem?
    var lastFire: TimeInterval = 0
    return { (p1: T) in
        guard currentWorkItem == nil else { return }
        currentWorkItem = DispatchWorkItem {
            action(p1)
            lastFire = Date().timeIntervalSinceReferenceDate
            currentWorkItem = nil
        }
        delay.hasPassed(since: lastFire) ? queue.async(execute: currentWorkItem!) : queue.asyncAfter(deadline: .now() + delay, execute: currentWorkItem!)
    }
}
