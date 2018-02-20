#!/usr/bin/env node
import Server from './server'
import Browser from './debugBrowser'

const sessions = [{ port: '9000' }, { port: '9001' }]

const browser = new Browser({
  sessions,
})

browser.start()

new Server({
  onTargets(targets = []) {
    if (!Array.isArray(targets)) {
      return
    }
    const targetSessions = targets.map(id => ({ id, port: 8000 }))
    const next = [...sessions, ...targetSessions]
    console.log('setSessions', next)
    browser.setSessions(next)
  },
})
