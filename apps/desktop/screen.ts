import Oracle from '@mcro/oracle'
import { debounce, throttle, last } from 'lodash'
import iohook from 'iohook'
import { store, isEqual, react } from '@mcro/black/store'
import { Desktop, Electron, Swift, AppState, DesktopState } from '@mcro/all'
import debug from '@mcro/debug'
import * as Mobx from 'mobx'

const log = debug('screen')
debug.quiet('screen')
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

@store
export default class DesktopScreen {
  hasResolvedOCR = false
  appStateTm: any
  clearOCRTm: any
  isWatching = ''
  curAppID = ''
  curAppName = ''
  watchSettings = { name: '', settings: {} }
  oracle = new Oracle()

  @react rescanOnNewAppState = [() => Desktop.appState, this.rescanApp]

  @react
  handleOCRWords = [
    () => Desktop.ocrState.words,
    words => {
      if (!words) {
        return
      }
      log(`> ${words.length} words`)
      this.watchBounds('OCR', {
        fps: 12,
        sampleSpacing: 2,
        sensitivity: 1,
        showCursor: true,
        boxes: words.map(([x, y, width, height], id) => ({
          id,
          x,
          y,
          width,
          height,
          initialScreenshot: false,
          findContent: false,
          ocr: false,
        })),
      })
    },
  ]

  togglePaused = () => {
    const paused = !Desktop.state.paused
    Desktop.setPaused(paused)
    if (paused) {
      Swift.pause()
    } else {
      Swift.resume()
      this.rescanApp()
    }
  }

  start = async () => {
    Desktop.onMessage(msg => {
      switch (msg) {
        case Desktop.messages.TOGGLE_PAUSED:
          this.togglePaused()
      }
    })

    this.oracle.onWords(words => {
      this.hasResolvedOCR = true
      Desktop.setOcrState({
        words,
        updatedAt: Date.now(),
      })
    })

    this.oracle.onLines(lines => {
      Desktop.setOcrState({
        lines,
      })
    })
    this.oracle.onWindowChange((event, value) => {
      if (event === 'ScrollEvent') {
        this.rescanApp()
        return
      }
      log(`got event ${event} ${JSON.stringify(value)}`)
      const lastState = Mobx.toJS(Desktop.appState)
      let nextState: Partial<AppState> = {}
      let id = this.curAppID
      const wasFocusedOnOrbit = this.curAppID === ORBIT_APP_ID
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          id = value.id
          nextState = {
            id,
            title: value.title,
            offset: value.offset,
            bounds: value.bounds,
            name: id ? last(id.split('.')) : value.title,
          }
          // update these now so we can use to track
          this.curAppID = id
          this.curAppName = nextState.name
          break
        case 'WindowSizeChangedEvent':
          nextState.bounds = value.size
          break
        case 'WindowPosChangedEvent':
          nextState.offset = value.pos
      }
      // no change
      if (isEqual(nextState, lastState)) {
        return
      }
      const focusedOnOrbit = this.curAppID === ORBIT_APP_ID
      // @ts-ignore
      const state: Partial<DesktopState> = {
        focusedOnOrbit,
        appState: nextState,
      }
      // when were moving into focus prevent app, store its appName, pause then return
      if (PREVENT_APP_STATE[this.curAppName]) {
        Desktop.setFocusedOnOrbit(focusedOnOrbit)
        this.oracle.pause()
        return
      }
      state.appStateUpdatedAt = Date.now()
      if (
        !wasFocusedOnOrbit &&
        !PREVENT_CLEAR[this.curAppName] &&
        !PREVENT_CLEAR[nextState.name]
      ) {
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
      clearTimeout(this.appStateTm)
      // @ts-ignore
      this.appStateTm = this.setTimeout(() => {
        Desktop.setState(state)
      }, 4)
    })
    this.oracle.onBoxChanged(count => {
      if (!Desktop.ocrState.words) {
        log('RESET oracle boxChanged (App)')
        this.lastScreenChange()
        if (this.isWatching === 'OCR') {
          log('reset is watching ocr to set back to app')
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
          log('RESET oracle boxChanged (NOTTTTTTT App)')
          this.lastScreenChange()
          this.rescanApp()
        }
      }
    })
    this.oracle.onRestored(count => {
      log('restore', count)
      Desktop.setOcrState({
        restoreWords: this.oracle.restoredIds,
      })
    })
    this.oracle.onError(async error => {
      log('screen ran into err, restart', error)
      this.restartScreen()
    })
    this.watchMouse()
    await this.oracle.start()
  }

  async restartScreen() {
    log('restartScreen')
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

  watchMouse = () => {
    iohook.on(
      'mousemove',
      throttle(({ x, y }) => {
        Desktop.setMouseState({
          position: { x, y },
        })
      }, 40),
    )
    iohook.on('mousedown', ({ button, x, y }) => {
      if (button === 1) {
        Desktop.setMouseState({ mouseDown: { x, y, at: Date.now() } })
      }
    })
    iohook.on('mouseup', ({ button }) => {
      if (button === 1) {
        Desktop.setMouseState({ mouseDown: null })
      }
    })
  }

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
    log('rescanApp.resume', name)
    await this.oracle.resume()
    this.clearOCRTm = setTimeout(async () => {
      if (!this.hasResolvedOCR) {
        log('seems like ocr has stopped working, restarting...')
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
    log('screen disposed')
  }
}
