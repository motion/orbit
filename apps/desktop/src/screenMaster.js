// @flow
import { Server } from 'ws'
import Oracle from '@mcro/oracle'
import { isEqual, throttle, last } from 'lodash'
import iohook from 'iohook'
import killPort from 'kill-port'
import { store } from '@mcro/black/store'
import Screen from '@mcro/screen'

const PORT = 40510
const DESKTOP_KEY = 'desktop'
const APP_ID = -1

Screen.start('desktop')
// TODO make this go through the screenStore

// prevent apps from clearing highlights
const PREVENT_CLEARING = {
  electron: true,
  Chromium: true,
}
// prevent apps from triggering appState updates
const PREVENT_WATCHING = {
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
  curAppName = null
  watchSettings = {}

  state = {
    paused: false,
    appState: null,
    ocrWords: null,
    linePositions: null,
    lastOCR: Date.now(),
    lastScreenChange: Date.now(),
    mousePosition: { x: 0, y: 0 },
    keyboard: {},
    clearWords: {},
    restoreWords: {},
  }

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
      () => this.setState({ paused: !this.state.paused }),
    )

    this.oracle.onLines(linePositions => {
      this.setState({
        linePositions,
      })
    })
    this.oracle.onClear(() => {
      console.log('RESET oracle onClear')
      this.resetHighlights()
    })
    let lastId = null
    this.oracle.onWindowChange((event, value) => {
      if (this.state.paused) {
        return
      }
      let nextState = { ...this.curState }
      let id = lastId
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
          break
        case 'WindowSizeChangedEvent':
          nextState.bounds = value
          break
        case 'WindowPosChangedEvent':
          nextState.offset = value
      }
      if (!nextState.name) {
        console.log('no name recevied', value)
        return
      }
      // update before prevent_watching
      this.curAppName = nextState.name
      if (event === 'ScrollEvent') {
        this.resetHighlights()
        return
      }
      if (PREVENT_WATCHING[nextState.name]) {
        this.oracle.pause()
        return
      }

      console.log('onWindowChange', event, value)
      this.oracle.resume()

      // clear old stuff
      if (lastId !== id) {
        console.log('RESET oracle onWindowChange', nextState.name)
        this.resetHighlights()
      }

      // update
      this.curState = nextState
      this.setState({
        appState: JSON.parse(JSON.stringify(this.curState)),
      })
    })
    this.oracle.onBoxChanged(count => {
      const isApp = this.watchSettings.name === 'App'
      if (isApp) {
        console.log('RESET oracle boxChanged (App)')
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
          console.log('RESET oracle boxChanged (Not App)')
          this.resetHighlights()
          this.rescanApp()
        }
      }
    })
    this.oracle.onRestored(count => {
      console.log('restore', count)
      this.setState({
        restoreWords: this.oracle.restoredIds,
      })
    })
    this.oracle.onError(async error => {
      console.log('screen ran into err, restart', error)
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
    console.log('restartScreen')
    this.resetHighlights()
    await this.oracle.stop()
    console.log('starting back up')
    await this.oracle.start()
    this.watchBounds(this.watchSettings.name, this.watchSettings.settings)
  }

  resetHighlights = () => {
    if (PREVENT_CLEARING[this.curAppName]) {
      console.log('resetHighlights prevented clear')
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
      // console.log('keycode', keycode)
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
      console.log('stopped, dont send')
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
    this.state = { ...this.state, ...object }
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
      console.log('is stopped')
      return
    }
    const { name, offset, bounds } = this.state.appState
    if (!offset || !bounds) {
      console.log('todo: initial offset/bounds')
      return
    }
    clearTimeout(this.clearOCRTimeout)
    if (PREVENT_SCANNING[name]) {
      return
    }
    console.log('> ', name)
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
        console.log('seems like ocr has stopped working, restarting...')
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
    console.log(`> ${this.state.ocrWords.length} words`)
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
    console.log('disposing screen...')
    if (this.oracle) {
      await this.oracle.stop()
    }
    console.log('screen disposed')
  }

  socketSend = (socket, state: Object) => {
    try {
      socket.send(JSON.stringify({ source: DESKTOP_KEY, state }))
    } catch (err) {
      console.log('error with scoket', err.message, err.stack)
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
        console.log('API: failed to send to socket, removing', err.message, uid)
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
      console.log('screen-master received connection', uid)
      // send current state
      this.socketSend(socket, this.state)
      // add to active sockets
      this.activeSockets.push({ uid, socket })
      // listen for incoming
      socket.on('message', str => {
        const { action, value, state, source } = JSON.parse(str)
        if (state) {
          this.socketSendAll(source, state)
        }
        if (action && this[action]) {
          console.log('received action:', action)
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
      console.log('WE SHOULD HANDLE THIS CLOSE', ...arguments)
    })
    this.wss.on('error', (...args) => {
      console.log('wss error', args)
    })
  }
}
