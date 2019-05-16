import { OR_TIMED_OUT, orTimeout } from '@o/utils'

import { reporter } from './reporter'

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
    reporter.info('exit all')
    process.exit(0)
  }, 1000)

  reporter.info('Disposing...', disposers.length)
  if (disposers.length) {
    try {
      await orTimeout(
        Promise.all(
          disposers.map(dispose => {
            reporter.info('dispose', dispose)
            return dispose()
          }),
        ),
        1000,
      )
      clearTimeout(finaltm)
      reporter.info(`done disposing all, bye`)
    } catch (err) {
      if (err === OR_TIMED_OUT) {
        reporter.info('Timed out killing processes')
      } else {
        console.log(`Error disposing ${err.message}`)
        reporter.info(`${err.stack}`)
      }
    }
  }
  process.exit(0)
}