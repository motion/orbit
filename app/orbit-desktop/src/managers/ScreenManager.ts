import { Screen } from '@mcro/screen'
import { store, react, on, ensure } from '@mcro/black'
import { Desktop, Electron, App } from '@mcro/stores'

// handles the screen blur window as well as any information relating to the current
// OS screen state like spaces.

@store
export class ScreenManager {
  clearTimeout?: Function
  isStarted = false
  screen: Screen

  constructor({ screen }: { screen: Screen }) {
    this.screen = screen
  }

  start = () => {
    this.isStarted = true

    this.screen.onTrayState(state => {
      console.log('on app state...', state)
      if (typeof state === 'string') {
        Desktop.sendMessage(App, App.messages.TRAY_EVENT, state)
        return
      }
      if (state.trayBounds) {
        Desktop.setState({ operatingSystem: { trayBounds: state.trayBounds } })
        return
      }
    })

    // space move
    let mvtm
    this.screen.onSpaceMove(() => {
      console.log('got space move...')
      Desktop.setState({ movedToNewSpace: Date.now() })
      clearTimeout(mvtm)
      mvtm = setTimeout(() => {
        this.screen.socketSend('mvsp')
      }, 220)
    })

    // poll for now for space moves...
    const listener = setInterval(() => {
      this.screen.socketSend('space')
    }, 400)
    on(this, listener)
  }

  get shouldShowBackgroundWindow() {
    return process.env.IGNORE_ELECTRON !== 'true'
  }

  updateTheme = react(
    () => (App.state.darkTheme ? 'ultra' : 'light'),
    async (theme, { when }) => {
      ensure('shouldShowBackgroundWindow', this.shouldShowBackgroundWindow)
      await when(() => this.isStarted)
      this.screen.themeWindow(theme)
    },
  )

  updateWindowVisibility = react(
    () => App.orbitState.docked,
    async (visible, { when }) => {
      await when(() => this.isStarted)
      if (visible && this.shouldShowBackgroundWindow) {
        this.screen.showWindow()
      } else {
        this.screen.hideWindow()
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
    if (this.shouldShowBackgroundWindow) {
      this.screen.positionWindow(position)
    }
  }

  private getPosition() {
    const { position, size } = App.orbitState
    const [x, y] = position
    const [width, height] = size
    return {
      x: Math.round(x),
      // mac topbar 23
      y: Math.round(y + 23),
      width: Math.round(width),
      height: Math.round(height - 10),
    }
  }
}
