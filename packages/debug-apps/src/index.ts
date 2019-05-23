#!/usr/bin/env node
import 'isomorphic-fetch'

import killPort from 'kill-port'

import Browser from './debugBrowser'


// quiet exit handling
let browser

const setExiting = async () => {
  console.log('Exit debugbrowser, disposing...')
  setTimeout(() => {
    process.kill(process.pid)
  }, 40)
  if (browser) {
    await browser.dispose()
    console.log('dispsoed')
  }
  process.exit(0)
}
process.on('unhandledRejection', function(reason: any) {
  if (reason.message.indexOf('Execution context was destroyed.')) {
    return
  }
  console.log('debug.unhandledRejection', reason.message, reason.stack)
})
process.on('SIGUSR1', setExiting)
process.on('SIGUSR2', setExiting)
process.on('SIGSEGV', setExiting)
process.on('SIGINT', setExiting)
process.on('exit', setExiting)

export default async function start({ expectTabs = null, sessions = [], port = 8000 } = {}) {
  await killPort(port)
  browser = new Browser({
    sessions,
    expectTabs,
  })
  browser.start()
}
