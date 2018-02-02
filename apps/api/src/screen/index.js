// @flow
import { Server } from 'ws'
import ScreenOCR from '@mcro/screen'
import Swindler from '@mcro/swindler'
import { isEqual, throttle, last } from 'lodash'
import iohook from 'iohook'
import * as Constants from '~/constants'
import killPort from 'kill-port'

const PORT = 40510

const APP_ID = 'screen'
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
  screenOCR = new ScreenOCR()
  activeSockets = []
  swindler = new Swindler()
  curAppState = {}
  screenSettings = {}
  extraAppState = {}

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
    this.screenOCR.onClearWord(word => {
      this.resetHighlights()
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

  setupSocket() {
    let id = 0
    this.wss.on('connection', socket => {
      let uid = id++
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

  setExtraAppState = state => {
    this.extraAppState = state
  }

  async restartScreen() {
    console.log('restartScreen')
    await this.screenOCR.stop()
    console.log('starting back up')
    await this.screenOCR.start()
    this.screenOCR.watchBounds(this.screenSettings)
  }

  startSwindler() {
    console.log('Start swindling...')
    this.swindler.start()

    const update = () => {
      // ensure new
      this.updateState({
        appState: {
          ...JSON.parse(JSON.stringify(this.curAppState)),
          ...this.extraAppState, // from electron
        },
      })
    }

    let lastId = null
    this.swindler.onChange(({ event, message }) => {
      // immediately cancel stuff
      this.resetHighlights()
      // prevent from running until we update bounds
      this.screenOCR.clear().watchBounds({
        fps: 1,
        sampleSpacing: 100,
        sensitivity: 20,
        showCursor: false,
        boxes: [],
      })
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          const value = {
            ...this.curAppState,
            id: lastId,
            ...message,
          }
          lastId = value.id
          this.setAppState(value)
          break
        case 'WindowSizeChangedEvent':
          this.curAppState.bounds = message
          break
        case 'WindowPosChangedEvent':
          this.curAppState.offset = message
      }
      update()
    })
  }

  setAppState = nextAppState => {
    // if given id, reset to new appState
    if (nextAppState.id) {
      this.curAppState = {
        id: nextAppState.id,
      }
    }
    const { curAppState } = this
    const { id } = curAppState
    curAppState.title = nextAppState.title
    curAppState.offset = nextAppState.offset
    curAppState.bounds = nextAppState.bounds
    curAppState.name = id ? last(id.split('.')) : curAppState.title
    // adjust for more specifc content area found
    if (this.contentArea) {
      const [x, y, width, height] = this.contentArea
      // divide here for retina
      curAppState.offset[0] += x / 2
      curAppState.offset[1] += y / 2
      curAppState.bounds[0] += width / 2
      curAppState.bounds[1] += height / 2
      console.log('adjusting for content area', curAppState)
    }
  }

  resetHighlights = () => {
    this.updateState({
      lastScreenChange: Date.now(),
    })
  }

  watchKeyboard = () => {
    const optionKey = 56
    iohook.on('keydown', ({ keycode }) => {
      const isOptionKey = keycode === optionKey
      // clear option key if other key pressed during
      if (this.state.keyboard.option && !isOptionKey) {
        this.updateState({ keyboard: { option: false } })
        return
      }
      // option on
      if (isOptionKey) {
        this.updateState({ keyboard: { option: true } })
      }
    })
    iohook.on('keyup', ({ keycode }) => {
      // option off
      if (keycode === optionKey) {
        this.updateState({ keyboard: { option: false } })
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

  onChangedState = async (oldState, newStateItems) => {
    const newAppState = newStateItems.appState
    if (newAppState) {
      this.handleAppState()
    }
  }

  handleAppState = async () => {
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
    console.log('name', name)
    // we are watching the whole app for words
    const settings = {
      fps: 10,
      sampleSpacing: 10,
      sensitivity: 1,
      showCursor: false,
      boxes: [
        {
          id: APP_ID,
          x: offset[0],
          y: offset[1],
          width: bounds[0],
          height: bounds[1],
          screenDir: Constants.TMP_DIR,
          initialScreenshot: true,
          findContent: true,
        },
      ],
    }

    this.screenSettings = settings
    this.hasResolvedOCR = false
    this.screenOCR.watchBounds(settings)

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

  stop = () => {
    this.stopped = true
  }

  dispose() {
    console.log('disposing screen...')
    if (this.screenOCR) {
      this.screenOCR.stop()
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

  socketSendAll = data => {
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
}
