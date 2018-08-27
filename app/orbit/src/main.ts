import { findContiguousPorts } from './findContiguousPorts'
import { setGlobalConfig, GlobalConfig } from '@mcro/config'
import killPort from 'kill-port'
import { cleanupChildren } from './cleanupChildren'
import * as Path from 'path'
import { startDesktop } from './startDesktop'
// @ts-ignore
import { app, dialog } from 'electron'
import { logger } from '@mcro/logger'

const log = logger(process.env.IS_DESKTOP ? 'desktop' : 'electron')

type OrbitOpts = {
  version: string
}

// this runs as the entry for both processes
// first electron, then desktop
// this lets us share config more easily
// and also use the bundled electron binary as the entry point
// which lets us pack things into an asar
export async function main({ version }: OrbitOpts) {
  // if were in desktop we get config through here
  let config: GlobalConfig = process.env.CONFIG
    ? JSON.parse(process.env.CONFIG)
    : null

  // if not we're in the root electron process, lets set it up once...
  if (!config) {
    const ports = await findContiguousPorts(5, 3333)
    if (!ports) {
      console.log('no ports found!')
      return
    }

    // for some reason you'll get "directv-tick" consistently on a port
    // even though that port was found to be empty....
    // so attempting to make sure we kill anything even if it looks empty
    try {
      console.log('Found ports, ensuring clear', ports)
      await Promise.all(ports.map(port => killPort(port)))
    } catch {
      // errors are just showing the ports are empty
    }

    const rootDirectory = Path.join(__dirname, '..', '..', '..', '..')
    console.log('rootDirectory', rootDirectory)

    console.log(`\n\n\n\n\n\n ${app.getAppPath()} .... ${app.getPath('exe')}`)

    const root = __dirname
    const appStatic = Path.join(
      require.resolve('@mcro/orbit-app'),
      '..',
      'dist',
    )
    let nodeBinary = 'node'
    if (process.env.NODE_ENV !== 'development') {
      nodeBinary = Path.join(root, '..', '..', 'MacOS', 'Orbit')
    }
    const dotApp = Path.join(root, '..', '..', '..', '..', '..', '..')
    config = {
      isProd: process.env.NODE_ENV !== 'development',
      paths: {
        root,
        appStatic,
        userData: app.getPath('appData'),
        nodeBinary,
        dotApp,
      },
      urls: {
        authProxy: 'http://private.tryorbit.com',
        server: `http://localhost:${ports[0]}`,
      },
      version,
      ports: {
        server: ports[0],
        bridge: ports[1],
        swift: ports[2],
        dbBridge: ports[3],
        oracleBridge: ports[4],
      },
    }
  }

  // both processes now run this part to have their config setup
  setGlobalConfig(config)

  // IS in desktop process, go do its thing...
  if (process.env.IS_DESKTOP) {
    // lets run desktop now
    require('@mcro/desktop')
    return
  }

  // else, electron...
  let desktopPid
  const handleExit = async () => {
    console.log('Orbit exiting...')
    if (desktopPid) {
      process.kill(desktopPid)
    }
    console.log('Cleaning children...')
    await cleanupChildren()
    console.log('bye!')
  }

  // start electron...
  const ElectronApp = require('@mcro/orbit-electron')
  ElectronApp.main()

  app.on('before-quit', () => {
    console.log('Electron handle exit...')
    handleExit()
  })

  // fork desktop process...
  // fail message
  let desktopFailMsg = ''
  const failStartTm = setTimeout(() => {
    dialog.showMessageBox({
      message: `Node process didnt start: ${desktopFailMsg}`,
      buttons: ['Ok'],
    })
  }, 5000)

  log('In production, starting desktop...')
  try {
    desktopPid = startDesktop()
    console.log('>>>>>>> desktop pid is', desktopPid)
  } catch (err) {
    desktopFailMsg = `${err.message}`
  }

  log('Waiting for desktop startup to continue...')
  await waitPort({ port })
  clearTimeout(failStartTm)
  log('Found desktop, continue...')
}

// PRODUCTION
if (process.env.NODE_ENV !== 'development') {
  // start desktop...

  // move to app folder
  if (!app.isInApplicationsFolder()) {
    app.dock.bounce('informational')
    const response = dialog.showMessageBox({
      type: 'question',
      title: 'Move to apps?',
      message: 'Move Orbit to Applications folder?',
      buttons: ['Cancel', 'Ok'],
      defaultId: 1,
      cancelId: 0,
    })
    if (response === 1) {
      try {
        app.moveToApplicationsFolder()
      } catch (err) {
        console.log('error moving to app folder', err)
      }
    }
  }
}
