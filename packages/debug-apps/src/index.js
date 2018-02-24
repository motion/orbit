#!/usr/bin/env node
import Server from './server'
import Browser from './debugBrowser'
import killPort from 'kill-port'

export default async function start({ sessions = [], port = 8000 } = {}) {
  await killPort(port)
  let allSessions = sessions
  const browser = new Browser({
    sessions,
  })
  browser.start()
  new Server({
    onTargets(targets = []) {
      if (!Array.isArray(targets)) return
      const targetSessions = targets.map(id => ({ id, port }))
      const next = [...allSessions, ...targetSessions]
      browser.setSessions(next)
    },
  })
}
