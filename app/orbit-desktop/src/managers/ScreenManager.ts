import { Oracle } from '@mcro/oracle'
import { store, react, on } from '@mcro/black'
import { Desktop, Electron, App } from '@mcro/stores'
import macosVersion from 'macos-version'

// handles the oracle blur window as well as any information relating to the current
// OS screen state like spaces.

// @ts-ignore
@store
export class ScreenManager {
  clearTimeout?: Function
  hasResolvedOCR = false
  appStateTm: any
  clearOCRTm: any
  isWatching = ''
  curAppID = ''
  curAppName = ''
  isStarted = false
  watchSettings = { name: '', settings: {} }
  oracle: Oracle

  constructor(oracle: Oracle) {
    this.oracle = oracle

    // for now just enable until re enable oracle
    if (macosVersion.is('<10.11')) {
      console.log('older mac, avoiding oracle')
      return
    }

    // operating info
    this.oracle.onInfo(info => {
      if (typeof info.supportsTransparency === 'boolean') {
        Desktop.setState({
          operatingSystem: {
            supportsTransparency: info.supportsTransparency,
          },
        })
        return
      }
    })

    // space move
    let mvtm
    this.oracle.onSpaceMove(() => {
      console.log('got space move...')
      Desktop.setState({ movedToNewSpace: Date.now() })
      clearTimeout(mvtm)
      mvtm = setTimeout(() => {
        this.oracle.socketSend('mvsp')
      }, 220)
    })

    // poll for now for space moves...
    const listener = setInterval(() => {
      this.oracle.socketSend('space')
    }, 400)
    on(this, listener)

    // poll for now for updated transparency setting...
    const listener2 = setInterval(() => {
      this.oracle.socketSend('osin')
    }, 1000 * 10)
    on(this, listener2)
  }

  start = () => {
    this.isStarted = true
  }

  updateTheme = react(
    () => (App.state.darkTheme ? 'ultra' : 'light'),
    async (theme, { when }) => {
      await when(() => this.isStarted)
      this.oracle.themeWindow(theme)
    },
  )

  updateWindowVisibility = react(
    () => App.orbitState.docked,
    async (visible, { when, sleep }) => {
      await when(() => this.isStarted)
      if (visible) {
        this.oracle.showWindow()
      } else {
        this.oracle.hideWindow()
      }
    },
  )

  updateWindowPositionOnOrbitChange = react(
    () => this.getPosition(),
    async (position, { when }) => {
      await when(() => this.isStarted)
      this.positionOrbit(position)
    },
  )

  updateWindowPositionOnScreenRezie = react(
    () => Electron.state.screenSize,
    async (_, { sleep }) => {
      await sleep(100)
      this.positionOrbit()
    },
    {
      deferFirstRun: true,
    },
  )

  private positionOrbit(position = this.getPosition()) {
    this.oracle.positionWindow(position)
  }

  private getPosition() {
    const { position, size } = App.orbitState
    const [x, y] = position
    const [width, height] = size
    return {
      x: Math.round(x - 10),
      // mac topbar 23
      y: Math.round(y + 23 + 10),
      width: Math.round(width),
      height: Math.round(height - 30),
    }
  }
}
