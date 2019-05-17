import { logFile } from '@o/logger'
import { clipboard, dialog } from 'electron'
import { pathExists, readFile } from 'fs-extra'
import open from 'opn'
import Raven from 'raven'

import { handleExit } from './handleExit'

Raven.config('https://e885a093bbcb4d5fb2527dfe921f7654@sentry.io/1282871').install()

// puts the last of the log and the current error onto the clipboard
// and opens mail if you want it to

let lastReported = 0

export async function onError(error) {
  if (!error) {
    console.log('---no error---', error)
    return
  }
  console.log('\n\n---error---\n\n', error.message, '\n', error.stack)

  // in insider mode capture exceptions
  Raven.captureException(error.stack)

  // for beta just report
  return

  const errorMessage = `${error.message || ''}\n${error.stack || ''}`

  // avoid certain errors that aren't easily catchable (like websockets)...
  if (/WebSocket is|syncer/.test(errorMessage)) {
    console.log('avoiding sending to report')
    return
  }

  // if less than 5 seconds ago we reported an error, dont bombard them
  if (Date.now() - lastReported < 1000 * 5) {
    console.log('too soon')
    return
  }

  lastReported = Date.now()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Orbit ran into an error!',
    buttons: ['Copy to clipboard', 'Quit', 'Cancel'],
    message: `Orbit ran into an error:\n\n${errorMessage.slice(
      0,
      250,
    )}...\n\nWould you like to paste error to your clipboard to report it?`,
    defaultId: 0,
    cancelId: 2,
  })

  if (response === 2) {
    return
  }

  // quit
  if (response === 1) {
    handleExit()
  }

  if (response === 0) {
    let log = ''
    const logPath = logFile.findLogPath()
    if (await pathExists(logPath)) {
      log = await readFile(logPath, 'utf-8')
      // limit how much we take
      const len = log.length
      const take = 10000 // characters
      log = log.slice(len - take, len)
    }

    // write
    const niceError = `
Stack:
${errorMessage}

Log:
${log}`

    // copy to clipboard...
    clipboard.writeText(niceError)

    const { response } = await dialog.showMessageBox({
      type: 'question',
      title: 'Error copied!',
      message: 'Upload error/log to Orbit?',
      buttons: ['Quick report error', 'Send as email', 'Never ask again', 'No thanks'],
      defaultId: 0,
      cancelId: 3,
    })
    if (response === 0) {
      Raven.captureException(niceError)
      return
    }
    if (response === 1) {
      open(
        `mailto:support@tryorbit.com?subject=${encodeURIComponent(
          'Orbit Error',
        )}&body=${encodeURIComponent(niceError)}`,
      )
    }
  }
}

export function handleErrors() {
  // @ts-ignore
  process.on('uncaughtException', onError)
  // @ts-ignore
  process.on('unhandledRejection', onError)
}
