// @flow
import { Server } from 'ws'
import Oracle from '@mcro/oracle'
import { isEqual, throttle, last } from 'lodash'
import iohook from 'iohook'
import killPort from 'kill-port'
import { store } from '@mcro/black/store'
import Screen from '@mcro/screen'

const log = debug('screenMaster')

const PORT = 40510
const DESKTOP_KEY = 'desktop'
const APP_ID = -1

Screen.start('desktop')
// TODO make this go through the screenStore

// prevent apps from clearing highlights
const PREVENT_CLEARING = {
  electron: true,
  Chromium: true,
  iterm2: true,
}
// prevent apps from triggering appState updates
const PREVENT_APP_STATE = {
  iterm2: true,
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
export default class ScreenState {
  stopped = false
  oracle = new Oracle()
  activeSockets = []
  curState = {}
  watchSettings = {}

  state = Object.freeze({
    // start paused
    paused: true,
    appState: {},
    ocrWords: null,
    linePositions: null,
    lastOCR: Date.now(),
    lastScreenChange: Date.now(),
    mousePosition: { x: 0, y: 0 },
    keyboard: {},
    clearWords: {},
    restoreWords: {},
  })

  get hasListeners() {
    return !!this.activeSockets.length
  }

  start = async () => {
    // and kill anything on this port
    await killPort(PORT)
    this.wss = new Server({ port: PORT })
    this.setupSocket()
    this.stopped = false
    this.oracle.onWords(words => {
      this.hasResolvedOCR = true
      this.setState({
        ocrWords: words,
        lastOCR: Date.now(),
      })
    })

    // watch paused
    this.react(
      () => Screen.electronState.shouldPause,
      () => {
        const paused = !this.state.paused
        this.setState({ paused })
        if (paused) {
          Screen.swiftBridge.pause()
        } else {
          Screen.swiftBridge.resume()
        }
      },
    )

    this.oracle.onLines(linePositions => {
      this.setState({
        linePositions,
      })
    })
    this.oracle.onClear(() => {
      this.resetHighlights()
    })
    this.oracle.onWindowChange((event, value) => {
      if (event === 'ScrollEvent') {
        this.resetHighlights()
        return
      }
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
          if (this.curAppID !== id) {
            this.resetHighlights()
          }
          this.curAppID = id
          this.curAppName = nextState.name
          break
        case 'WindowSizeChangedEvent':
          console.log('sizeevent', value.id, id)
          if (value.id !== id) return
          nextState.bounds = value.size
          break
        case 'WindowPosChangedEvent':
          console.log('posevent', value.id, id)
          if (value.id !== id) return
          nextState.offset = value.pos
      }
      if (PREVENT_APP_STATE[this.curAppName]) {
        log('preventState', this.curAppName)
        this.oracle.pause()
        return
        // prevent other events except change window
      }
      if (!this.state.paused) {
        this.oracle.resume()
      }
      // update
      const appState = JSON.parse(JSON.stringify(nextState))
      log('set.appState', appState)
      this.setState({
        appState,
      })
    })
    this.oracle.onBoxChanged(count => {
      const isApp = this.watchSettings.name === 'App'
      if (isApp) {
        log('RESET oracle boxChanged (App)')
        this.resetHighlights()
        this.setState({ clearWord: APP_ID })
      } else {
        // for not many clears, try it
        if (count < 20) {
          this.setState({
            clearWord: this.oracle.changedIds,
          })
        } else {
          // else just clear it all
          log('RESET oracle boxChanged (Not App)')
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
    // clear old highlights if theyre still up
    this.resetHighlights()
  }

  async restartScreen() {
    log('restartScreen')
    this.resetHighlights()
    await this.oracle.stop()
    log('starting back up')
    await this.oracle.start()
    this.watchBounds(this.watchSettings.name, this.watchSettings.settings)
  }

  resetHighlights = () => {
    if (PREVENT_CLEARING[this.state.appState.name]) {
      log('resetHighlights prevented clear')
      return
    }
    this.setState({
      lastScreenChange: Date.now(),
    })
  }

  watchKeyboard = () => {
    const codes = {
      option: 56,
      up: 57416,
      down: 57424,
      space: 57,
      pgUp: 3657,
      pgDown: 3665,
    }
    const updateKeyboard = newState =>
      this.setState({ keyboard: { ...this.state.keyboard, ...newState } })

    // keydown
    iohook.on('keydown', ({ keycode }) => {
      // log('keycode', keycode)
      if (keycode === codes.option) {
        return updateKeyboard({ option: true, optionCleared: false })
      }
      // clear option key if other key pressed during
      if (this.state.keyboard.option) {
        return updateKeyboard({ optionCleared: true })
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
      // option off
      if (keycode === codes.option) {
        updateKeyboard({ option: false, optionCleared: false })
      }
    })
  }

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
    if (this.stopped) {
      log('stopped, dont send')
      return
    }
    let hasNewState = false
    for (const key of Object.keys(object)) {
      if (!isEqual(this.state[key], object[key])) {
        hasNewState = true
        break
      }
    }
    if (!hasNewState) {
      return
    }
    const oldState = this.state
    this.state = Object.freeze({ ...this.state, ...object })
    // sends over (oldState, changedState, newState)
    this.onChangedState(oldState, object, this.state)
    // only send the changed things to reduce overhead
    this.socketSendAll(DESKTOP_KEY, object)
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

  rescanApp = async () => {
    if (this.stopped) {
      log('is stopped')
      return
    }
    const { name, offset, bounds } = this.state.appState
    if (PREVENT_SCANNING[name] || PREVENT_APP_STATE[name]) {
      return
    }
    if (!offset || !bounds) {
      log('todo: initial offset/bounds')
      return
    }
    clearTimeout(this.clearOCRTimeout)
    log('> ', name)
    // we are watching the whole app for words
    this.watchBounds('App', {
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
    // not paused, clear and resume
    this.oracle.clear()
    this.oracle.resume()
    this.clearOCRTimeout = setTimeout(async () => {
      if (!this.hasResolvedOCR) {
        log('seems like ocr has stopped working, restarting...')
        this.restartScreen()
      }
    }, 15000)
  }

  watchBounds(name: String, settings: Object) {
    this.isWatching = name
    this.watchSettings = { name, settings }
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

  stop = () => {
    this.stopped = true
  }

  async dispose() {
    // clear highlights on quit
    this.resetHighlights()
    if (this.oracle) {
      await this.oracle.stop()
    }
    log('screen disposed')
  }

  socketSend = (socket, state: Object) => {
    try {
      socket.send(JSON.stringify({ source: DESKTOP_KEY, state }))
    } catch (err) {
      log('error with scoket', err.message, err.stack)
    }
  }

  socketSendAll = (source: string, state: Object) => {
    if (!source) {
      throw new Error(`No source provided to state message`)
    }
    const strData = JSON.stringify({ state, source })
    for (const { socket, uid } of this.activeSockets) {
      try {
        socket.send(strData)
      } catch (err) {
        log('API: failed to send to socket, removing', err.message, uid)
        this.removeSocket(uid)
      }
    }
  }

  removeSocket = uid => {
    this.activeSockets = this.activeSockets.filter(s => s.uid !== uid)
  }

  setupSocket() {
    let id = 0
    this.wss.on('connection', socket => {
      let uid = id++
      // send current state
      this.socketSend(socket, this.state)
      // add to active sockets
      this.activeSockets.push({ uid, socket })
      log('screen-master:', this.activeSockets.length, 'connections')
      // listen for incoming
      socket.on('message', str => {
        const { action, value, state, source } = JSON.parse(str)
        if (state) {
          this.socketSendAll(source, state)
        }
        if (action && this[action]) {
          log('received action:', action)
          this[action].call(this, value)
        }
      })
      // handle events
      socket.on('close', () => {
        this.removeSocket(uid)
      })
      socket.on('error', err => {
        // ignore ECONNRESET throw anything else
        if (err.code !== 'ECONNRESET') {
          throw err
        }
        this.removeSocket(uid)
      })
    })
    this.wss.on('close', () => {
      log('WE SHOULD HANDLE THIS CLOSE', ...arguments)
    })
    this.wss.on('error', (...args) => {
      log('wss error', args)
    })
  }
}
