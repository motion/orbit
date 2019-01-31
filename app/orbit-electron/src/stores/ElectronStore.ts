import { debugState } from '@mcro/black'
import root from 'global'

export class ElectronStore {
  error = null
  appRef = null
  stores = null
  views = null
  clear = Date.now()
  apps = new Set()

  async didMount() {
    console.log('Electron Store did mount')
    root.Root = this
    root.restart = this.restart
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })
  }

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
    root.handleExit()
  }
}
