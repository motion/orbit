// @flow
import Oracle from '@mcro/oracle'
import { debounce, isEqual, throttle, last } from 'lodash'
import iohook from 'iohook'

import { store } from '@mcro/black/store'
import { App, Desktop, Electron, Swift } from '@mcro/all'
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

const sources = {
  App,
  Electron,
  Desktop,
}

@store
export default class ScreenMaster {
  watchSettings = {}
  oracle = new Oracle()
  socketManager = new SocketManager({
    port: 40510,
    source: 'Desktop',
    actions: {
      onGetState: ({ source, socket }) => {
        // send current state of all apps besides the one requesting
        for (const name of Object.keys(sources)) {
          if (name === source) continue
          // send state from source
          this.socketManager.send(socket, sources[name].state, name)
        }
      },
    },
  })

  start = async () => {
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
        const paused = !Desktop.state.paused
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
        this.rescanApp()
        return
      }
      this.setState({ lastAppChange: Date.now() })
      // if current app is a prevented app, treat like nothing happened
      let nextState = { ...Desktop.state.appState, updatedAt: Date.now() }
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
            this.lastScreenChange()
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
      if (!Desktop.state.paused) {
        this.oracle.resume()
      }
      // log('set.appState', appState)
      clearTimeout(this.lastAppState)
      this.lastAppState = this.setTimeout(() => {
        const appState = JSON.parse(JSON.stringify(nextState))
        this.setState({
          appState,
        })
      }, 32)
    })
    this.oracle.onBoxChanged(count => {
      if (!Desktop.state.ocrWords) {
        log('RESET oracle boxChanged (App)')
        this.lastScreenChange()
        if (this.isWatching === 'OCR') {
          log('reset is watching ocr to set back to app')
          this.rescanApp()
        }
      } else {
        // for not many clears, try it
        if (count < 20) {
          // this.setState({
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
      this.setState({
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
    this.setState({
      lastScreenChange: Date.now(),
    })
    // after fast clear, empty data
    setTimeout(this.clearOCRState)
  }

  clearOCRState = debounce(() => {
    this.setState({
      linePositions: null,
      ocrWords: null,
    })
  }, 32)

  watchMouse = () => {
    iohook.on(
      'mousemove',
      throttle(({ x, y }) => {
        this.setState({
          mousePosition: { x, y },
        })
      }, 64),
    )
  }

  setState = object => {
    let hasNewState = false
    for (const key of Object.keys(object)) {
      if (!isEqual(Mobx.toJS(Desktop.state[key]), object[key])) {
        hasNewState = true
        break
      }
    }
    if (!hasNewState) {
      return
    }
    const oldState = Desktop.state
    Desktop.state = Object.freeze({ ...Desktop.state, ...object })
    Desktop.setState(object, true)
    // sends over (oldState, changedState, newState)
    this.onChangedState(oldState, object, Desktop.state)
    // only send the changed things to reduce overhead
    this.socketManager.sendAll(DESKTOP_KEY, object)
  }

  onChangedState = async (oldState, newState) => {
    if (Desktop.state.paused) {
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
    const { name, offset, bounds } = Desktop.state.appState
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
  }, 32)

  watchBounds = async (name: String, settings: Object) => {
    this.isWatching = name
    this.watchSettings = { name, settings }
    await this.oracle.pause()
    this.oracle.watchBounds(settings)
  }

  handleOCRWords = () => {
    this.lastWordsSet = Date.now()
    log(`> ${Desktop.state.ocrWords.length} words`)
    this.watchBounds('OCR', {
      fps: 12,
      sampleSpacing: 2,
      sensitivity: 1,
      showCursor: true,
      boxes: Desktop.state.ocrWords.map(([x, y, width, height, word], id) => ({
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
    this.lastScreenChange()
    if (this.oracle) {
      await this.oracle.stop()
    }
    log('screen disposed')
  }
}
