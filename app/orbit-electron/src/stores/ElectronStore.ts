import { Electron } from '@mcro/stores'
import { store, debugState, sleep } from '@mcro/black'
import root from 'global'
import { Logger } from '@mcro/logger'
import { getScreenSize } from '../helpers/getScreenSize'
import { screen } from 'electron'

const log = new Logger('ElectronStore')

@store
export class ElectronStore {
  error = null
  appRef = null
  stores = null
  views = null
  clear = Date.now()
  show = 0
  apps = new Set()

  async didMount() {
    console.log('Electron Store did mount')
    root.Root = this
    root.restart = this.restart
    debugState(({ stores, views }) => {
      this.stores = stores
      this.views = views
    })

    this.setScreenSize()
    this.reset()

    screen.on('display-metrics-changed', async () => {
      log.info('got display metrics changed event')
      // give it a bit to adjust
      await sleep(100)
      this.setScreenSize()
      this.reset()
    })
  }

  private setScreenSize = () => {
    Electron.setState({ screenSize: getScreenSize() })
  }

  async reset() {
    log.info('Resetting...')
    this.show = 0
    await sleep(16)
    this.show = 2
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
