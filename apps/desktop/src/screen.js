// @flow
import Oracle from '@mcro/oracle'
import { debounce, throttle, last } from 'lodash'
import iohook from 'iohook'
import { store, isEqual, react } from '@mcro/black/store'
import { Desktop, Electron, Swift } from '@mcro/all'

const log = debug('screenMaster')
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
export default class ScreenMaster {
  watchSettings = {}
  oracle = new Oracle()

  @react rescanOnNewAppState = [() => Desktop.appState, this.rescanApp]

  @react
  handleOCRWords = [
    () => Desktop.ocrState.words,
    words => {
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

  start = async () => {
    this.oracle.onWords(words => {
      this.hasResolvedOCR = true
      Desktop.setOcrState({
        words: words,
        updatedAt: Date.now(),
      })
    })

    // watch paused
    this.react(
      () => Electron.state.shouldPause,
      () => {
        const paused = !Desktop.state.paused
        Desktop.setPaused(!paused)
        if (paused) {
          Swift.pause()
        } else {
          Swift.resume()
          this.rescanApp()
        }
      },
    )

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
      // if current app is a prevented app, treat like nothing happened
      let nextState = { ...Desktop.appState }
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
          if (value.id !== id) return
          nextState.bounds = value.size
          break
        case 'WindowPosChangedEvent':
          if (value.id !== id) return
          nextState.offset = value.pos
      }
      log('id', this.curAppID)
      const state = {
        focusedOnOrbit: this.curAppID === ORBIT_APP_ID,
      }
      // when were moving into focus prevent app, store its appName, pause then return
      if (PREVENT_APP_STATE[this.curAppName]) {
        Desktop.setState(state)
        this.oracle.pause()
        return
      }
      state.appState = JSON.parse(JSON.stringify(nextState))
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
          Desktop.setState({ lastAppChange: Date.now() })
        }
      }
      if (!Desktop.state.paused) {
        this.oracle.resume()
      }
      clearTimeout(this.lastAppState)
      this.lastAppState = this.setTimeout(() => {
        Desktop.setState(state)
      }, 32)
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
    Desktop.setLastScreenChange(Date.now())
    // after fast clear, empty data
    setTimeout(this.clearOCRState)
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
      }, 64),
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
    clearTimeout(this.clearOCRTimeout)
    if (!Desktop.appState.id) {
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
    this.clearOCRTimeout = setTimeout(async () => {
      if (!this.hasResolvedOCR) {
        log('seems like ocr has stopped working, restarting...')
        this.restartScreen()
      }
    }, 15000)
  }

  watchBounds = async (name: String, settings: Object) => {
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
