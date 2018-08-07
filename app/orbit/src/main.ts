import { findContiguousPorts } from './findContiguousPorts'
import * as ElectronApp from '@mcro/orbit-electron'

async function main() {
  const ports = await findContiguousPorts(3, 3333)
  console.log('found ports', ports)
  ElectronApp.main({ port: ports[0] })
}

main()
