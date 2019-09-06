import { cleanupChildren } from '@o/orbit-fork-process'
import { once } from 'lodash'

export async function main() {
  /*
   *  Setup app after config
   */
  const { OrbitDesktopRoot } = require('./OrbitDesktopRoot')
  const desktopRoot = new OrbitDesktopRoot()

  // handle exits gracefully
  const dispose = once(async () => {
    require('fs').writeFileSync('/tmp/hi2', 'hi')
    console.log('Desktop exiting...')
    await desktopRoot.dispose()
    console.log('Dispose children...')
    try {
      cleanupChildren()
    } catch (err) {
      console.log('error on children dispose', err)
    }
    console.log('bye')
    process.exit(0)
  })
  process.on('exit', dispose)
  process.on('SIGINT', dispose)
  process.on('SIGSEGV', dispose)
  process.on('SIGTERM', dispose)
  process.on('SIGQUIT', dispose)

  if (process.env.NODE_ENV === 'development') {
    require('./helpers/startDevelopment').startDevelopment(desktopRoot)
  }

  try {
    await desktopRoot.start()
  } catch (err) {
    console.error('error starting desktopRoot', err)
    process.exit(1)
  }

  return dispose
}

if (process.env.AUTO_START) {
  main()
}
