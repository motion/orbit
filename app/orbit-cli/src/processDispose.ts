import { OR_TIMED_OUT, orTimeout } from '@o/utils'

import { log } from './command-dev'

process.on('exit', dispose)
process.on('SIGINT', dispose)
process.on('SIGSEGV', dispose)
process.on('SIGTERM', dispose)
process.on('SIGQUIT', dispose)

let disposers = []

export function addProcessDispose(fn: Function) {
  disposers.push(fn)
}

async function dispose() {
  // for some reason orTimeout wasnt returning after error
  let finaltm = setTimeout(() => {
    process.exit(0)
  }, 1000)

  log('Disposing...')
  try {
    await orTimeout(
      Promise.all(
        disposers.map(dispose => {
          return dispose()
        }),
      ),
      1000,
    )
    clearTimeout(finaltm)
  } catch (err) {
    if (err === OR_TIMED_OUT) {
      log('Timed out killing processes')
    } else {
      console.log(`Error disposing ${err.message}`)
      log(`${err.stack}`)
    }
  }
}
