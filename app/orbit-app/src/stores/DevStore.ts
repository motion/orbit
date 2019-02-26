import { sleep, store } from '@mcro/black'
import { getGlobalConfig } from '@mcro/config'

const Config = getGlobalConfig()
const onPort = async cb => {
  await sleep(200)
  try {
    await fetch(`http://localhost:${Config.ports.server}`)
    cb()
  } catch (_) {
    onPort(cb)
  }
}

@store
export class DevStore {
  stores = null
  views = null
  errors = []

  constructor() {
    this.catchErrors()
  }

  async restart() {
    onPort(() => (window.location = window.location))
  }

  catchErrors() {
    window.addEventListener('unhandledrejection', event => {
      console.log('unhandler rejection', event)
    })
  }

  clearErrors = () => {
    this.errors = []
  }
}
