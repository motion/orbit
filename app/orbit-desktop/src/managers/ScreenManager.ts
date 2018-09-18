import { Oracle } from '@mcro/oracle'
import { debounce, last } from 'lodash'
import { store, isEqual, react, on, sleep, ensure } from '@mcro/black'
import { Desktop, Electron, App } from '@mcro/stores'
import { Logger } from '@mcro/logger'
import * as Mobx from 'mobx'
import macosVersion from 'macos-version'
import { runAppleScript } from '../helpers'

const log = new Logger('screen')
const ORBIT_APP_ID = 'com.github.electron'
const APP_ID = -1

// prevent apps from clearing highlights
const PREVENT_CLEAR = {
  electron: true,
  Chromium: true,
  // iterm2: true,
  // VSCode: true,
}
// prevent apps from triggering appState updates
const PREVENT_APP_STATE = {
  // iterm2: true,
  electron: true,
  Chromium: true,
}
// prevent apps from OCR
const PREVENT_SCANNING = {
  iterm2: true,
  VSCode: true,
  Xcode: true,
  finder: true,
  electron: true,
  Chromium: true,
  ActivityMonitor: true,
}

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
  }

  start = async () => {
    // for now just enable until re enable oracle
    if (macosVersion.is('<10.11')) {
      console.log('older mac, avoiding oracle')
      return
    }

    this.setupOracleListeners()
    await this.oracle.start()

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

    this.isStarted = true
  }
  rescanOnNewAppState = react(() => Desktop.appState, this.rescanApp)

  // handleOCRWords = react(
  //   () => Desktop.ocrState.words,
  //   words => {
  //     if (!words) {
  //       return
  //     }
  //     log.info(`> ${words.length} words`)
  //     this.watchBounds('OCR', {
  //       fps: 12,
  //       sampleSpacing: 2,
  //       sensitivity: 1,
  //       showCursor: true,
  //       boxes: words.map(([x, y, width, height], id) => ({
  //         id,
  //         x,
  //         y,
  //         width,
  //         height,
  //         initialScreenshot: false,
  //         findContent: false,
  //         ocr: false,
  //       })),
  //     })
  //   },
  // )

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

  lastAppName = null

  setupOracleListeners() {
    // ok
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

    // accessiblity check
    this.oracle.onAccessible(isAccessible => {
      console.log('is accessible, start watching stuff', isAccessible)
      Desktop.setState({
        operatingSystem: { isAccessible },
      })
      if (isAccessible) {
        // this.watchMouse()
      }
    })

    // OCR words
    this.oracle.onWords(words => {
      this.hasResolvedOCR = true
      Desktop.setOcrState({
        words,
        updatedAt: Date.now(),
      })
    })

    // OCR lines
    this.oracle.onLines(lines => {
      Desktop.setOcrState({
        lines,
      })
    })

    // window movements
    this.oracle.onWindowChange((event, value) => {
      if (event === 'ScrollEvent') {
        this.rescanApp()
        return
      }
      // console.log(`got event ${event} ${JSON.stringify(value)}`)
      const lastState = Mobx.toJS(Desktop.appState)
      let nextState: any = {}
      let id = this.curAppID
      const wasFocusedOnOrbit = this.curAppID === ORBIT_APP_ID
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          id = value.id
          nextState = {
            id,
            title: value.title,
            offset: value.position,
            bounds: value.size,
            name: id ? last(id.split('.')) : value.title,
          }
          // update these now so we can use to track
          this.curAppID = id
          this.curAppName = nextState.name
          break
        case 'WindowPosChangedEvent':
          nextState.bounds = value.size
          nextState.offset = value.position
      }
      // no change
      if (isEqual(nextState, lastState)) {
        return
      }
      const focusedOnOrbit = this.curAppID === ORBIT_APP_ID
      Desktop.setState({ focusedOnOrbit })
      const state: Partial<typeof Desktop.state> = {
        appState: nextState,
      }
      // when were moving into focus prevent app, store its appName, pause then return
      if (PREVENT_APP_STATE[this.curAppName]) {
        this.oracle.pause()
        return
      }
      state.appStateUpdatedAt = Date.now()
      if (!wasFocusedOnOrbit && !PREVENT_CLEAR[this.curAppName] && !PREVENT_CLEAR[nextState.name]) {
        const { appState } = Desktop.state
        if (
          !isEqual(nextState.bounds, appState.bounds) ||
          !isEqual(nextState.offset, appState.offset)
        ) {
          // immediate clear for moving
          Desktop.sendMessage(Electron, Electron.messages.CLEAR)
        }
      }
      if (!Desktop.state.paused) {
        this.oracle.resume()
      }
      if (this.clearTimeout) {
        this.clearTimeout()
      }
      this.clearTimeout = on(
        this,
        setTimeout(() => {
          Desktop.setState(state)
        }, 4),
      )
    })

    // OCR work clear
    this.oracle.onBoxChanged(count => {
      if (!Desktop.ocrState.words) {
        log.info('RESET oracle boxChanged (App)')
        this.lastScreenChange()
        if (this.isWatching === 'OCR') {
          log.info('reset is watching ocr to set back to app')
          this.rescanApp()
        }
      } else {
        // for not many clears, try it
        if (count < 20) {
          // Desktop.setState({
          //   clearWord: this.oracle.changedIds,
          // })
        } else {
          // else just clear it all
          log.info('RESET oracle boxChanged (NOTTTTTTT App)')
          this.lastScreenChange()
          this.rescanApp()
        }
      }
    })

    // OCR word restore
    this.oracle.onRestored(count => {
      log.info('restore', count)
      Desktop.setOcrState({
        restoreWords: this.oracle.restoredIds,
      })
    })

    // general errors
    this.oracle.onError(async error => {
      log.info('screen ran into err, restart', error)
      this.restartScreen()
    })
  }

  async restartScreen() {
    log.info('restartScreen')
    this.lastScreenChange()
    await this.oracle.stop()
    this.watchBounds(this.watchSettings.name, this.watchSettings.settings)
    await this.oracle.start()
  }

  lastScreenChange = () => {
    if (PREVENT_CLEAR[Desktop.state.appState.name]) {
      return
    }
    // after fast clear, empty data
    Desktop.setLastScreenChange(Date.now())
    this.clearOCRState()
  }

  clearOCRState = debounce(() => {
    Desktop.setOcrState({
      words: null,
      lines: null,
    })
  }, 32)

  // iohook based mouse move
  // mouseHookIds = []
  // watchMouse = () => {
  //   this.unWatchMouse()
  //   this.mouseHookIds = [
  //     iohook.on('mousemove', throttle(this.handleMousePosition, 32)),
  //     iohook.on('mousedown', ({ button, x, y }) => {
  //       if (button === 1) {
  //         const TITLE_BAR_HEIGHT = 23
  //         Desktop.setMouseState({
  //           mouseDown: { x, y: y - TITLE_BAR_HEIGHT, at: Date.now() },
  //         })
  //       }
  //     }),
  //     iohook.on('mouseup', ({ button }) => {
  //       if (button === 1) {
  //         Desktop.setMouseState({ mouseDown: null })
  //       }
  //     }),
  //   ]
  // }

  // unWatchMouse = () => {
  //   this.mouseHookIds.map(id => iohook.unregisterShortcut(id))
  //   this.mouseHookIds = []
  // }

  // mouseOverShowDelay: any = 0
  // this aws for a little orbit indicator that follows windows
  // was an experiment that is off now can likely remove once we
  // re-enable sidebar and decide if we want it
  // checkHoverIndicator = (mousePos, position) => {
  //   const [oX, oY] = position
  //   // TODO: Constants.ORBIT_WIDTH
  //   const adjX = App.orbitOnLeft ? 313 : 17
  //   const adjY = 36
  //   const withinX = Math.abs(oX - mousePos.x + adjX) < 6
  //   const withinY = Math.abs(oY - mousePos.y + adjY) < 15
  //   if (withinX && withinY) {
  //     this.mouseOverShowDelay = setTimeout(() => {
  //       Desktop.sendMessage(App, App.messages.SHOW)
  //     }, 250)
  //   }
  // }

  async rescanApp() {
    clearTimeout(this.clearOCRTm)
    if (!Desktop.appState.id || Desktop.state.paused) {
      return
    }
    const { name, offset, bounds } = Desktop.appState
    if (PREVENT_SCANNING[name] || PREVENT_APP_STATE[name]) return
    if (!offset || !bounds) return
    this.lastScreenChange()
    // we are watching the whole app for words
    await this.watchBounds('App', {
      fps: 10,
      sampleSpacing: 100,
      sensitivity: 1,
      showCursor: false,
      boxes: [
        {
          id: APP_ID,
          x: offset[0],
          y: offset[1],
          width: bounds[0],
          height: bounds[1],
          // screenDir: Constants.TMP_DIR,
          initialScreenshot: true,
          findContent: true,
          ocr: true,
        },
      ],
    })
    this.hasResolvedOCR = false
    if (Desktop.state.paused) {
      return
    }
    log.info('rescanApp.resume', name)
    await this.oracle.resume()
    this.clearOCRTm = setTimeout(async () => {
      if (!this.hasResolvedOCR) {
        log.info('seems like ocr has stopped working, restarting...')
        this.restartScreen()
      }
    }, 15000)
  }

  watchBounds = async (name, settings) => {
    this.isWatching = name
    this.watchSettings = { name, settings }
    await this.oracle.pause()
    this.oracle.watchBounds(settings)
  }

  async dispose() {
    if (this.oracle) {
      await this.oracle.stop()
    }
    log.info('screen disposed')
  }
}
