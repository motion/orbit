#!/usr/bin/env node
import Server from './server'
import Browser from './debugBrowser'
import killPort from 'kill-port'

// quiet exit handling
let browser

const setExiting = async () => {
  console.log('Exit debugbrowser...')
  if (browser) {
    await browser.dispose()
  }
  setTimeout(() => {
    process.kill(process.pid)
  })
}
process.on('unhandledRejection', function(reason) {
  console.log('debug.unhandledRejection', reason.message)
  console.log(reason)
})
process.on('SIGUSR1', setExiting)
process.on('SIGUSR2', setExiting)
process.on('SIGSEGV', setExiting)
process.on('SIGINT', setExiting)
process.on('exit', setExiting)

export default async function start({
  expectTabs,
  sessions = [],
  port = 8000,
} = {}) {
  await killPort(port)
  let allSessions = sessions
  browser = new Browser({
    sessions,
    expectTabs,
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
