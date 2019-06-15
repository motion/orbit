import { configureUseStore, debugUseStore } from '@o/use-store'
import root from 'global'

configureUseStore({
  debugStoreState: true,
})

debugUseStore(event => {
  if (event.type === 'state') {
    root.stores = event.value
  }
})

export class ElectronDebugStore {
  error = null
  appRef = null
  stores = null
  views = null
  clear = Date.now()
  apps = new Set()

  restart() {
    if (process.env.NODE_ENV === 'development') {
      require('touch')(require('path').join(__dirname, '..', '..', '_', 'main.js'))
    }
  }

  handleAppRef = ref => {
    if (!ref) return
    this.appRef = ref.app
    // this.appRef.dock.hide()
  }

  handleBeforeQuit = () => {
    console.log('before quit electron...')
  }

  handleQuit = () => {
    console.log('handling quit...')
    // 😱
    root.handleExit()
  }
}
