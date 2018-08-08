import { setConfig } from '@mcro/config'
import * as r2 from '@mcro/r2'

async function main() {
  // set config before app...
  const config = await r2.get('/config').json
  setConfig(config)

  // now run app..
  require('./start')
}

main()
