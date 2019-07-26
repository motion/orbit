import { cleanupChildren } from '@o/orbit-fork-process'
import { once } from 'lodash'

export async function main() {
  /*
   *  Setup app after config
   */
  const { OrbitDesktopRoot } = require('./OrbitDesktopRoot')
  const appRoot = new OrbitDesktopRoot()

  if (process.env.NODE_ENV === 'development') {
    require('./helpers/startDevelopment').startDevelopment(appRoot)
  }

  // handle exits gracefully
  const dispose = once(async () => {
    console.log('Desktop exiting...')
    await appRoot.dispose()
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

  await appRoot.start()

  return dispose
}

if (process.env.AUTO_START) {
  main()
}
