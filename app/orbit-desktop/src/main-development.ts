import { main } from './main'
import { setGlobalConfig } from '@mcro/config'

setGlobalConfig({
  userDataDirectory: '',
  rootDirectory: '',
  privateUrl: 'http://private.tryorbit.com',
  version: '0',
  ports: {
    server: 3001,
    bridge: 3003,
    swift: 3004,
    dbBridge: 3005,
    oracleBridge: 3006,
  },
})

main({
  port: 3001,
})
