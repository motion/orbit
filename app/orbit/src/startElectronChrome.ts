import { spawn, ChildProcess } from 'child_process'
import { getGlobalConfig } from '@mcro/config'
import * as Path from 'path'

const Config = getGlobalConfig()

export function startElectronChrome(): ChildProcess {
  // enable remote debugging in dev
  const root = Path.join(__dirname, 'main')
  let args = [root]
  if (!Config.isProd) {
    args = ['--inspect=9004', '--remote-debugging-port=9005', ...args]
  }
  try {
    console.log('Starting Electron Chrome Process:', Config.paths.nodeBinary, args)
    const child = spawn(
      process.env.NODE_ENV === 'development' ? 'electron' : Config.paths.nodeBinary,
      args,
      {
        // detached: true,
        env: {
          // pass down process args...
          ...process.env,
          PROCESS_NAME: 'electron-chrome',
          STACK_FILTER: 'orbit-electron-chrome',
          SUB_PROCESS: 'electron-chrome',
          NODE_ENV: process.env.NODE_ENV,
          ORBIT_CONFIG: JSON.stringify(Config),
          PATH: process.env.PATH,
        },
      },
    )

    child.stdout.on('data', b => console.log('electron-chrome:', b.toString()))
    child.stderr.on('data', b => {
      const error = b.toString()
      // for some reason node logs into error
      if (error.indexOf('Debugger ') === 0) {
        return
      }
      if (error.indexOf('Error') === -1) {
        console.log('\n\n\n got an error but may not be worth reporting:')
        console.log('   error:', error, '\n\n\n')
        return
      }
      if (process.env.IS_ELECTRON_CHROME) {
        console.log('error is', error)
      } else {
        console.log('CHILD ERROR', error)
      }
    })

    return child
  } catch (err) {
    console.log('error starting desktop', err)
  }
}
