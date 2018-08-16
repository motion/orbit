import { setConfig } from '@mcro/config'
import * as r2 from '@mcro/r2'

async function main() {
  // set config before app starts...
  const config = await r2.get('/config').json
  console.log('got config', config)
  setConfig(config)

  // now run app..
  require('./start')
}

main()
