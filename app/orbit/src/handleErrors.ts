import { clipboard, dialog } from 'electron'
import open from 'opn'
// @ts-ignore
import { logFile } from '@mcro/logger'
import { pathExists, readFile } from 'fs-extra'
import { showConfirmDialog } from './showConfirmDialog'
import Raven from 'raven'

Raven.config('https://e885a093bbcb4d5fb2527dfe921f7654@sentry.io/1282871').install()

// puts the last of the log and the current error onto the clipboard
// and opens mail if you want it to

let lastReported = 0

export async function onError(error) {
  if (!error) {
    console.log('---no error---', error)
    return
  }
  console.log('\n\n---error---\n\n', error)
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

  if (
    showConfirmDialog({
      type: 'warning',
      title: 'Orbit ran into an error!',
      message: `Orbit ran into an error:\n${errorMessage.slice(
        0,
        50,
      )}...\n\nWould you like to paste error to your clipboard to report it?`,
    })
  ) {
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

    const res = dialog.showMessageBox({
      type: 'question',
      title: 'Error copied!',
      message: 'Quick upload error to Orbit?',
      buttons: ['Quick report error', 'Open in email', 'No thanks'],
      defaultId: 0,
      cancelId: 2,
    })
    if (res === 0) {
      Raven.captureException(niceError)
      return
    }
    if (res === 1) {
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
