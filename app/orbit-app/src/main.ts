import 'react-hot-loader' // must be imported before react
import { setGlobalConfig } from '@mcro/config'
import { App } from '@mcro/stores'

// because for some reason we are picking up electron process.env stuff...
// we want this for web-app because stack traces dont have filenames properly
// see Logger.ts
if (process.env) {
  process.env.STACK_FILTER = 'true'
}

async function main() {
  // set config before app starts...
  const config = await fetch('/config').then(res => res.json())
  console.log('app:', window.location.href, config)
  setGlobalConfig(config)

  await App.start()

  // now run app..
  require('./start')
}

main()
