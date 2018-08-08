import { main } from './main'
import { setConfig } from '@mcro/config'

setConfig({
  ports: {
    server: 3001,
    bridge: 3003,
    swift: 3004,
  },
})

main({
  port: 3001,
})
