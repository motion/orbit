import { findContiguousPorts } from './findContiguousPorts'
import * as ElectronApp from '@mcro/orbit-electron'
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
  ElectronApp.main({ port: ports[0] })
}

main()
