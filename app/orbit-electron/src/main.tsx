import 'source-map-support/register'
import 'raf/polyfill'
import waitPort from 'wait-port'
import { ElectronApp } from './ElectronApp'

Error.stackTraceLimit = Infinity

export async function main() {
  await waitPort({ port: 3002 })
  await waitPort({ port: 3001 })
  new ElectronApp()
}

main()
