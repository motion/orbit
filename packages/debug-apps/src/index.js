#!/usr/bin/env node
import Server from './server'
import Browser from './debugBrowser'
import killPort from 'kill-port'

async function start({
  sessions = [{ port: '9000' }, { port: '9001' }],
  port = 8000,
} = {}) {
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

start()
