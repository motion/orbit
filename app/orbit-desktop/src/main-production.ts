import { main } from './main'
import { setConfig } from '@mcro/config'

const port = process.argv[process.argv.indexOf('--port') + 1]
console.log('Running desktop on port', port, 'node_env', process.env.NODE_ENV)

if (!process.env.ORBIT_CONFIG) {
  throw new Error(`No orbit config in process.env.ORBIT_CONFIG!`)
}

setConfig(JSON.parse(process.env.ORBIT_CONFIG))

main({
  port,
})
