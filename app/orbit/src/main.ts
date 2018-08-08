import { findContiguousPorts } from './findContiguousPorts'
import { setConfig } from '@mcro/config'

async function main() {
  const ports = await findContiguousPorts(3, 3333)
  setConfig({
    ports: {
      server: ports[0],
      bridge: ports[1],
      swift: ports[2],
    },
  })

  // require apps after config
  const ElectronApp = require('@mcro/orbit-electron')
  ElectronApp.main({ port: ports[0] })
}

main()
