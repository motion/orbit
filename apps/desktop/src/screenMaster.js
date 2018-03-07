// @flow
import Oracle from '@mcro/oracle'
import { debounce, isEqual, throttle, last } from 'lodash'
import iohook from 'iohook'

import { store } from '@mcro/black/store'
import { Desktop, Electron } from '@mcro/all'
import SocketManager from './helpers/socketManager'
import * as Mobx from 'mobx'

// this is the desktop screen master
// acts as the desktop Screen which is "special"
// because it relays messages around for the other screen stores
// this file only handles the state related to Screen.desktopState
// the socket management is in SocketManager

const log = debug('screenMaster')
const DESKTOP_KEY = 'Desktop'
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
  // iterm2: true,
  electron: true,
  // Chromium: true,
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
  oracle = new Oracle()
  socketManager = new SocketManager({
    port: 40510,
    source: 'desktop',
    onConnection: socket => {
      // send current state
      this.socketManager.send(socket, this.state)
    },
  })
  watchSettings = {}

  get state() {
    return Desktop.state
  }

  set state(state) {
    Desktop.setState({ state })
  }

  start = async () => {
    // TODO make this go through the screenStore
    Desktop.start({
      ignoreSource: {
        [DESKTOP_KEY]: true,
      },
    })
    await this.socketManager.start()
    this.oracle.onWords(words => {
      this.hasResolvedOCR = true
      this.setState({
        ocrWords: words,
        lastOCR: Date.now(),
      })
    })

    // watch paused
    this.react(
      () => Electron.state.shouldPause,
      () => {
        const paused = !this.state.paused
        this.setState({ paused })
        if (paused) {
          Swift.pause()
        } else {
          Swift.resume()
          this.rescanApp()
        }
      },
    )

    this.oracle.onLines(linePositions => {
      this.setState({
        linePositions,
      })
    })
    this.oracle.onWindowChange((event, value) => {
      if (event === 'ScrollEvent') {
        this.resetHighlights()
        this.rescanApp()
        return
      }
      // if current app is a prevented app, treat like nothing happened
      let nextState = { ...this.state.appState }
      let id = this.curAppID
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
          const hasNewID = this.curAppID !== id
          const shouldClear =
            !PREVENT_CLEAR[this.curAppName] && !PREVENT_CLEAR[nextState.name]
          if (hasNewID && shouldClear) {
            this.resetHighlights()
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
      // when were moving into focus prevent app, store its appName, pause then return
      if (PREVENT_APP_STATE[this.curAppName]) {
        this.oracle.pause()
        return
      }
      if (!this.state.paused) {
        this.oracle.resume()
      }
      const appState = JSON.parse(JSON.stringify(nextState))
      // log('set.appState', appState)
      this.setState({
        appState,
      })
    })
    this.oracle.onBoxChanged(count => {
      if (!this.state.ocrWords) {
        log('RESET oracle boxChanged (App)')
        this.resetHighlights()
        if (this.isWatching === 'OCR') {
          log('reset is watching ocr to set back to app')
          this.rescanApp()
        }
      } else {
        // for not many clears, try it
        if (count < 20) {
          this.setState({
            clearWord: this.oracle.changedIds,
          })
        } else {
          // else just clear it all
          log('RESET oracle boxChanged (NOTTTTTTT App)')
          this.resetHighlights()
          this.rescanApp()
        }
      }
    })
    this.oracle.onRestored(count => {
      log('restore', count)
      this.setState({
        restoreWords: this.oracle.restoredIds,
      })
    })
    this.oracle.onError(async error => {
      log('screen ran into err, restart', error)
      this.restartScreen()
    })
    this.watchMouse()
    this.watchKeyboard()
    iohook.start()
    await this.oracle.start()
  }

  async restartScreen() {
    log('restartScreen')
    this.resetHighlights()
    await this.oracle.stop()
    this.watchBounds(this.watchSettings.name, this.watchSettings.settings)
    await this.oracle.start()
  }

  resetHighlights = () => {
    if (PREVENT_CLEAR[this.state.appState.name]) {
      return
    }
    this.setState({
      lastScreenChange: Date.now(),
    })
    // after fast clear, empty data
    this.clearOCRState()
  }

  clearOCRState = debounce(() => {
    this.setState({
      linePositions: null,
      ocrWords: null,
    })
  }, 32)

  watchKeyboard = () => {
    const codes = {
      esc: 1,
      option: 56,
      up: 57416,
      down: 57424,
      space: 57,
      pgUp: 3657,
      pgDown: 3665,
    }
    const updateKeyboard = newState =>
      this.setState({ keyboard: { ...this.state.keyboard, ...newState } })

    // only clear if necessary
    const clearOption = () => {
      const { option, optionUp } = this.state
      if (!option || !optionUp || option > optionUp) {
        updateKeyboard({ optionUp: Date.now() })
      }
    }

    // this is imperfect, iohook doesn't always match events perfectly
    // so in cases of errors, we clear it after a little delay
    const KeysDown = new Set()

    let pauseTm
    const clearDownKeysAfterPause = () => {
      clearTimeout(pauseTm)
      pauseTm = setTimeout(() => {
        KeysDown.clear()
      }, 3000)
    }

    // keydown
    iohook.on('keydown', ({ keycode }) => {
      KeysDown.add(keycode)
      clearDownKeysAfterPause()
      // log(`keydown: ${keycode}`)
      if (keycode === codes.esc) {
        return updateKeyboard({ esc: Date.now() })
      }
      const isOption = keycode === codes.option
      if (KeysDown.size > 1 && isOption) {
        log(`option: already holding ${KeysDown.size} keys`)
        return clearOption()
      }
      if (isOption) {
        log('option down')
        return updateKeyboard({ option: Date.now() })
      }
      if (KeysDown.has(codes.option)) {
        log('pressed key after option')
        return clearOption()
      }
      switch (keycode) {
        // clear highlights keys
        case codes.up:
        case codes.down:
        case codes.pgUp:
        case codes.pgDown:
          return this.resetHighlights()
      }
    })

    // keyup
    iohook.on('keyup', ({ keycode }) => {
      KeysDown.delete(keycode)
      clearDownKeysAfterPause()
      // option off
      if (keycode === codes.option) {
        clearOption()
      }
    })
  }

  watchMouse = () => {
    iohook.on(
      'mousemove',
      throttle(({ x, y }) => {
        console.log('x', x, y)
        this.setState({
          mousePosition: { x, y },
        })
      }, 64),
    )
  }

  setState = object => {
    let hasNewState = false
    for (const key of Object.keys(object)) {
      if (!isEqual(Mobx.toJS(this.state[key]), object[key])) {
        hasNewState = true
        break
      }
    }
    if (!hasNewState) {
      return
    }
    const oldState = this.state
    this.state = Object.freeze({ ...this.state, ...object })
    Desktop.setState(object, true)
    // sends over (oldState, changedState, newState)
    this.onChangedState(oldState, object, this.state)
    // only send the changed things to reduce overhead
    this.socketManager.sendAll(DESKTOP_KEY, object)
  }

  onChangedState = async (oldState, newState) => {
    if (this.state.paused) {
      return
    }
    if (newState.appState) {
      this.rescanApp()
      return
    }
    if (newState.ocrWords) {
      this.handleOCRWords()
    }
  }

  rescanApp = debounce(async () => {
    clearTimeout(this.clearOCRTimeout)
    const { name, offset, bounds } = this.state.appState
    if (PREVENT_SCANNING[name] || PREVENT_APP_STATE[name]) return
    if (!offset || !bounds) return
    this.resetHighlights()
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
    if (this.state.paused) {
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
  }, 32)

  watchBounds = async (name: String, settings: Object) => {
    this.isWatching = name
    this.watchSettings = { name, settings }
    await this.oracle.pause()
    this.oracle.watchBounds(settings)
  }

  handleOCRWords = () => {
    this.lastWordsSet = Date.now()
    log(`> ${this.state.ocrWords.length} words`)
    this.watchBounds('OCR', {
      fps: 12,
      sampleSpacing: 2,
      sensitivity: 1,
      showCursor: true,
      boxes: this.state.ocrWords.map(([x, y, width, height, word], id) => ({
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
  }

  async dispose() {
    // clear highlights on quit
    this.resetHighlights()
    if (this.oracle) {
      await this.oracle.stop()
    }
    log('screen disposed')
  }
}
