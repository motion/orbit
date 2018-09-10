import { setGlobalConfig } from '@mcro/config'
import * as r2 from '@mcro/r2'

async function main() {
  console.log('app:', window.location.href)

  // set config before app starts...
  const config = await r2.get('/config').json
  console.log('got config', config)
  setGlobalConfig(config)

  // now run app..
  require('./start')
}

main()
