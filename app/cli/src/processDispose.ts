import { OR_TIMED_OUT, orTimeout } from '@o/utils'

import { reporter } from './reporter'

process.on('exit', createDispose('exit'))
process.on('SIGINT', createDispose('SIGINT'))
process.on('SIGSEGV', createDispose('SIGSEGV'))
process.on('SIGTERM', createDispose('SIGTERM'))
process.on('SIGQUIT', createDispose('SIGQUIT'))

// log errors
process.on('uncaughtException', err => {
  console.error('uncaughtException', err.message, err.stack)
  process.exit(1)
})
process.on('unhandledRejection', err => {
  console.error('unhandledRejection', err)
  process.exit(1)
})

type Disposable = Function | { action: string; dispose: Function }

let disposers: Disposable[] = []

export function addProcessDispose(fn: Disposable) {
  disposers.push(fn)
}

function createDispose(action: string) {
  return async () => {
    reporter.verbose(`Dispose ${action}`)
    // for some reason orTimeout wasnt returning after error
    let finaltm = setTimeout(() => {
      reporter.info('exit all')
      process.exit(0)
    }, 1000)

    if (disposers.length) {
      try {
        await orTimeout(
          Promise.all(
            disposers.map(dispose => {
              if ('action' in dispose) {
                if (dispose.action === action) {
                  return dispose.dispose()
                } else {
                  return
                }
              } else {
                return dispose()
              }
            }),
          ),
          250,
        )
        clearTimeout(finaltm)
        reporter.info(`Until next time!`)
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
}
