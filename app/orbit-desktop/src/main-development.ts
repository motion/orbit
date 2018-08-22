import { main } from './main'
import { setConfig } from '@mcro/config'

setConfig({
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
