import { findContiguousPorts } from './findContiguousPorts'
import { setConfig } from '@mcro/config'
import killPort from 'kill-port'
import psTree from 'ps-tree'

type OrbitOpts = {
  version: string
}

export async function main({ version }: OrbitOpts) {
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

  setConfig({
    version,
    ports: {
      server: ports[0],
      bridge: ports[1],
      swift: ports[2],
      dbBridge: ports[3],
      oracleBridge: ports[4],
    },
  })

  // require apps after config
  const ElectronApp = require('@mcro/orbit-electron')
  ElectronApp.main({ port: ports[0] })

  // handle exits gracefully
  process.on('exit', () => {
    console.log('Orbit exiting...')
    const exitWait = setTimeout(() => {
      console.log('failed to exit gracefully!')
    }, 500)
    psTree(process.getuid(), (err, children) => {
      if (err) {
        console.log('error getting children', err)
        return
      }
      const pids = children.map(x => x.PID)
      console.log('exiting children', pids)
      for (const pid of pids) {
        process.kill(pid)
      }
      clearTimeout(exitWait)
    })
  })
}
