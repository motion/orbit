import { Oracle } from '@mcro/oracle'
import { debounce, last } from 'lodash'
import { store, isEqual, react } from '@mcro/black'
import { Desktop, Electron } from '@mcro/stores'
import { Logger } from '@mcro/logger'
import macosVersion from 'macos-version'
import { toJS } from 'mobx'

const log = new Logger('screen')
const ORBIT_APP_ID = 'com.github.electron'
const APP_ID = -1

// prevent apps from clearing highlights
const PREVENT_CLEAR = {
  electron: true,
  Chromium: true,
  iterm2: true,
  VSCode: true,
}
// prevent apps from triggering appState updates
const PREVENT_APP_STATE = {
  iterm2: true,
  electron: true,
  Chromium: true,
  VSCode: true,
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
export class OCRManager {
  clearTimeout?: Function
  hasResolvedOCR = false
  clearOCRTm: any
  isWatching = ''
  curAppID = ''
  curAppName = ''
  watchSettings = { name: '', settings: {} }
  lastAppName = null
  started = false
  isWatchingWindows = false
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
    this.started = true

    // listen for start toggle
    Desktop.onMessage(Desktop.messages.TOGGLE_PAUSED, () => {
      log.info('Toggle OCR...')
      Desktop.setOcrState({ paused: !Desktop.ocrState.paused })
    })
  }

  startOCROnActive = react(
    () => Desktop.ocrState.paused,
    async (paused, { when }) => {
      await when(() => this.started)
      console.log('OCR Active', !paused)
      if (paused) {
        if (this.isWatchingWindows) {
          this.oracle.stopWatchingWindows()
          this.isWatchingWindows = false
        }
      } else {
        this.oracle.checkAccessbility()
        // we start watching once accessbile comes down, see onAccessible
      }
    },
  )

  rescanOnNewAppState = react(
    () => Desktop.state.appState,
    () => {
      this.rescanApp()
    },
  )

  setupOracleListeners() {
    // accessiblity check
    this.oracle.onAccessible(isAccessible => {
      console.log('isAccessible?', isAccessible)
      Desktop.setState({
        operatingSystem: { isAccessible },
      })
      if (isAccessible) {
        this.oracle.startWatchingWindows()
        this.isWatchingWindows = true
      } else {
        this.oracle.requestAccessibility()
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
      console.log('got window change', event, value)
      if (event === 'ScrollEvent') {
        this.rescanApp()
        return
      }
      // console.log(`got event ${event} ${JSON.stringify(value)}`)
      const lastState = toJS(Desktop.appState)
      let appState: any = {}
      let id = this.curAppID
      const wasFocusedOnOrbit = this.curAppID === ORBIT_APP_ID
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          id = value.id
          appState = {
            id,
            name: id ? last(id.split('.')) : value.title,
            title: value.title,
            offset: value.position,
            bounds: value.size,
          }
          // update these now so we can use to track
          this.curAppID = id
          this.curAppName = appState.name
          break
        case 'WindowPosChangedEvent':
          appState.bounds = value.size
          appState.offset = value.position
      }
      // no change
      if (isEqual(appState, lastState)) {
        log.info('Same app state, ignoring scan')
        return
      }
      const focusedOnOrbit = this.curAppID === ORBIT_APP_ID
      Desktop.setState({ focusedOnOrbit })
      // when were moving into focus prevent app, store its appName, pause then return
      if (PREVENT_APP_STATE[this.curAppName]) {
        log.info('Prevent app state', this.curAppName)
        this.oracle.pause()
        return
      }
      if (!wasFocusedOnOrbit && !PREVENT_CLEAR[this.curAppName] && !PREVENT_CLEAR[appState.name]) {
        const { appState } = Desktop.state
        if (
          !isEqual(appState.bounds, appState.bounds) ||
          !isEqual(appState.offset, appState.offset)
        ) {
          console.log('ocr clearing...')
          // immediate clear for moving
          Desktop.sendMessage(Electron, Electron.messages.CLEAR)
        }
      }
      if (!Desktop.ocrState.paused) {
        this.oracle.resume()
      }
      console.log('setting app state!', appState)
      Desktop.setState({ appState })
    })

    // OCR work clear
    this.oracle.onBoxChanged(count => {
      if (!Desktop.ocrState.words) {
        log.info('RESET oracle boxChanged (App)')
        this.setScreenChanged()
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
          this.setScreenChanged()
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
  }

  async restartScreen() {
    log.info('restartScreen')
    this.setScreenChanged()
    await this.oracle.stop()
    this.watchBounds(this.watchSettings.name, this.watchSettings.settings)
    await this.oracle.start()
  }

  setScreenChanged = () => {
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

  async rescanApp() {
    console.log('rescanApp', Desktop.appState.id)
    clearTimeout(this.clearOCRTm)
    if (!Desktop.appState.id || Desktop.ocrState.paused) {
      console.log('No id or paused')
      return
    }
    const { name, offset, bounds } = Desktop.appState
    if (PREVENT_SCANNING[name] || PREVENT_APP_STATE[name]) {
      log.info('Prevent scanning app', name)
      return
    }
    if (!offset || !bounds) {
      log.info('No offset or no bounds')
      return
    }
    console.log('scanning new app')
    this.setScreenChanged()
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
    if (Desktop.ocrState.paused) {
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
    console.log('watchBounds', name, settings)
    this.isWatching = name
    this.watchSettings = { name, settings }
    await this.oracle.pause()
    this.oracle.watchBounds(settings)
  }
}
