// @flow
import { Server } from 'ws'
import ScreenOCR from '@mcro/screen'
import Swindler from '@mcro/swindler'
import { isEqual, throttle, last } from 'lodash'
import iohook from 'iohook'
import * as Constants from '~/constants'
import killPort from 'kill-port'
import Auth from './auth'
// import Crawl from './crawl'

const PORT = 40510

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

type TAppState = {
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
  appState?: TAppState,
  ocrWords?: [Word],
  linePositions?: [Number],
  lastOCR: Number,
  lastScreenChange: Number,
  mousePosition: [Number, Number],
  keyboard: Object,
  highlightWords: { [String]: boolean },
}

export default class ScreenState {
  stopped = false
  // crawl = new Crawl()
  screenOCR = new ScreenOCR()
  activeSockets = []
  swindler = new Swindler()
  curAppState = {}
  watchSettings = {}
  extraAppState = {}
  auth = null

  state: TScreenState = {
    appState: null,
    ocrWords: null,
    linePositions: null,
    lastOCR: Date.now(),
    lastScreenChange: Date.now(),
    mousePosition: [0, 0],
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
    this.auth = new Auth({ socket: this.wss })
    this.setupSocket()
    this.stopped = false
    this.screenOCR.onWords(words => {
      this.hasResolvedOCR = true
      this.updateState({
        ocrWords: words,
        lastOCR: Date.now(),
      })
    })
    this.screenOCR.onLines(linePositions => {
      this.updateState({
        linePositions,
      })
    })
    this.screenOCR.onClear(() => {
      this.resetHighlights()
    })
    this.screenOCR.onChanged(count => {
      console.log('clear count', count)
      const isApp = this.watchSettings.name === 'App'
      if (isApp) {
        this.resetHighlights()
        this.socketSendAll({ clearWord: APP_ID })
      } else {
        // for not many clears, try it
        if (count < 20) {
          this.socketSendAll({ clearWord: this.screenOCR.changedIds })
        } else {
          // else just clear it all
          this.resetHighlights()
          this.rescanApp()
        }
      }
    })
    this.screenOCR.onChangedIds(ids => {
      console.log('clear ids', ids)
      const isOCR = this.watchSettings.name === 'OCR'
      if (isOCR) {
        this.socketSendAll({ clearWords: ids })
        return
      }
    })
    this.screenOCR.onRestored(count => {
      console.log('restore', count)
      this.socketSendAll({ restoreWord: this.screenOCR.restoredIds })
    })
    this.screenOCR.onError(async error => {
      console.log('screen ran into err, restart', error)
      this.restartScreen()
    })
    this.watchMouse()
    this.watchKeyboard()
    iohook.start()
    await this.screenOCR.start()
    // clear old highlights if theyre still up
    this.resetHighlights()
    // swindler after ocr to ensure its ready
    this.startSwindler()
  }

  setExtraAppState = state => {
    this.extraAppState = state
  }

  async restartScreen() {
    console.log('restartScreen')
    this.resetHighlights()
    await this.screenOCR.stop()
    console.log('starting back up')
    await this.screenOCR.start()
    this.watchBounds(this.watchSettings.name, this.watchSettings.settings)
  }

  startSwindler() {
    console.log('Start watching window changes...')
    this.swindler.start()
    let lastId = null
    this.swindler.onChange(({ event, message }) => {
      // immediately cancel stuff
      this.resetHighlights()
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          const id = message.id || lastId
          this.curAppState = {
            id,
            title: message.title,
            offset: message.offset,
            bounds: message.bounds,
            name: id ? last(id.split('.')) : message.title,
          }
          lastId = id
          break
        case 'WindowSizeChangedEvent':
          this.curAppState.bounds = message
          break
        case 'WindowPosChangedEvent':
          this.curAppState.offset = message
      }
      this.updateState({
        appState: {
          ...JSON.parse(JSON.stringify(this.curAppState)),
          ...this.extraAppState, // from electron
        },
      })
    })
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
          mousePosition: [x, y],
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
    this.socketSendAll(object)
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
    if (this.screenOCR.state.isPaused) {
      console.log('ispaused')
      return
    }
    // not paused, clear and resume
    this.screenOCR.clear()
    this.screenOCR.resume()
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
    this.screenOCR.watchBounds(settings)
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
    if (this.screenOCR) {
      await this.screenOCR.stop()
    }
    if (this.swindler) {
      this.swindler.stop()
    }
    console.log('screen disposed')
  }

  socketSend = (socket, data) => {
    try {
      socket.send(JSON.stringify(data))
    } catch (err) {
      console.log('error with scoket', err.message, err.stack)
    }
  }

  socketSendAll = (data: Object) => {
    const strData = JSON.stringify(data)
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
        const { action, value } = JSON.parse(str)
        if (this[action]) {
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
