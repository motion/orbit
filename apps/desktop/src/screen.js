// @flow
import { Server } from 'ws'
import Oracle from '@mcro/oracle'
import { isEqual, throttle, last } from 'lodash'
import iohook from 'iohook'
import * as Constants from '~/constants'
import killPort from 'kill-port'

const PORT = 40510
const DESKTOP_KEY = 'desktop'
const APP_ID = -1
const BLACKLIST = {
  iterm2: true,
  VSCode: true,
  Xcode: true,
  finder: true,
  electron: true,
  ActivityMonitor: true,
}

console.log('writing screenshots to', Constants.TMP_DIR)

type TappState = {
  name: string,
  offset: [Number, Number],
  bounds: [Number, Number],
  screen: [Number, Number],
}

type Word = {
  word: string,
  weight: Number,
  top: Number,
  left: Number,
  width: Number,
  height: Number,
}

type TScreenState = {
  appState?: TappState,
  ocrWords?: [Word],
  linePositions?: [Number],
  lastOCR: Number,
  lastScreenChange: Number,
  mousePosition: { x: Number, y: Number },
  keyboard: Object,
  highlightWords: { [String]: boolean },
}

export default class ScreenState {
  stopped = false
  oracle = new Oracle()
  activeSockets = []
  curState = {}
  watchSettings = {}

  state: TScreenState = {
    appState: null,
    ocrWords: null,
    linePositions: null,
    lastOCR: Date.now(),
    lastScreenChange: Date.now(),
    mousePosition: { x: 0, y: 0 },
    keyboard: {},
    // some test highlight words
    highlightWords: {
      seen: true,
      for: true,
      the: true,
      has: true,
      are: true,
      is: true,
      then: true,
      with: true,
    },
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
      this.updateState({
        ocrWords: words,
        lastOCR: Date.now(),
      })
    })
    this.oracle.onLines(linePositions => {
      this.updateState({
        linePositions,
      })
    })
    this.oracle.onClear(() => {
      this.resetHighlights()
    })
    let lastId = null
    this.oracle.onWindowChange((event, value) => {
      // immediately cancel stuff
      this.resetHighlights()
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          const id = value.id || lastId
          this.curState = {
            id,
            title: value.title,
            offset: value.offset,
            bounds: value.bounds,
            name: id ? last(id.split('.')) : value.title,
          }
          lastId = id
          break
        case 'WindowSizeChangedEvent':
          this.curState.bounds = value
          break
        case 'WindowPosChangedEvent':
          this.curState.offset = value
      }
      this.updateState({
        appState: JSON.parse(JSON.stringify(this.curState)),
      })
    })
    this.oracle.onBoxChanged(count => {
      const isApp = this.watchSettings.name === 'App'
      if (isApp) {
        this.resetHighlights()
        this.socketSendAll(DESKTOP_KEY, { clearWord: APP_ID })
      } else {
        // for not many clears, try it
        if (count < 20) {
          this.socketSendAll(DESKTOP_KEY, { clearWord: this.oracle.changedIds })
        } else {
          // else just clear it all
          this.resetHighlights()
          this.rescanApp()
        }
      }
    })
    this.oracle.onChangedIds(ids => {
      console.log('clear ids', ids)
      const isOCR = this.watchSettings.name === 'OCR'
      if (isOCR) {
        this.socketSendAll(DESKTOP_KEY, { clearWords: ids })
        return
      }
    })
    this.oracle.onRestored(count => {
      console.log('restore', count)
      this.socketSendAll(DESKTOP_KEY, { restoreWords: this.oracle.restoredIds })
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
    this.updateState({
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
      this.updateState({ keyboard: { ...this.state.keyboard, ...newState } })

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
        this.updateState({
          mousePosition: { x, y },
        })
      }, 64),
    )
  }

  updateState = object => {
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
      console.log('didnt get offset/bounds')
      return
    }
    clearTimeout(this.clearOCRTimeout)
    if (BLACKLIST[name]) {
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
    if (this.oracle.state.isPaused) {
      console.log('ispaused')
      return
    }
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
      // clear old highlights if theyre still up
      this.resetHighlights()
      // add to active sockets
      this.activeSockets.push({ uid, socket })
      // listen for incoming
      socket.on('message', str => {
        const { action, value, state, source } = JSON.parse(str)
        if (state) {
          console.log('received state:', state)
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
