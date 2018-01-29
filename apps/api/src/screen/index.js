// @flow
import Path from 'path'
import Fs from 'fs-extra'
import { Server } from 'ws'
import ScreenOCR from '@mcro/screen'
import ocrScreenshot from '@mcro/ocr'
import Swindler from '@mcro/swindler'
import { isEqual, throttle } from 'lodash'
import iohook from 'iohook'
import * as Constants from '~/constants'

const sleep = ms => new Promise(res => setTimeout(res, ms))
const APP_ID = 'screen'
const APP_SCREEN_PATH = Path.join(Constants.TMP_DIR, `${APP_ID}.png`)
const DEBOUNCE_OCR = 1000
const TOP_BAR_HEIGHT = 23

type TContext = {
  appName: string,
  offset: [Number, Number],
  bounds: [Number, Number],
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
  context?: TContext,
  ocr?: Array<Word>,
  lastOCR: Number,
  lastScreenChange: Number,
  mousePosition: [Number, Number],
  keyboard: Object,
}

export default class ScreenState {
  stopped = false
  invalidRunningOCR = Date.now()
  hasNewOCR = false
  runningOCR = false
  screenDestination = Constants.TMP_DIR
  screenOCR = new ScreenOCR()
  wss = new Server({ port: 40510 })
  activeSockets = []
  id = 0
  nextOCR = null
  swindler = new Swindler()
  curContext = {}

  state: TScreenState = {
    context: null,
    ocr: null,
    lastOCR: Date.now(),
    lastScreenChange: Date.now(),
    mousePosition: [0, 0],
    keyboard: {},
  }

  constructor() {
    this.wss.on('connection', socket => {
      let uid = this.id++
      console.log('socket connecting', uid)
      // send current state
      this.socketSend(socket, this.state)
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

  get hasListeners() {
    return !!this.activeSockets.length
  }

  start = () => {
    this.stopped = false
    this.startSwindler()
    this.screenOCR.start()
    this.screenOCR.onWords(words => {
      console.log('got words', words ? words.length : 0)
      this.updateState({ ocrWords: words })
    })
    this.screenOCR.onClearWord(word => {
      console.log('clear', word)
    })
    this.watchMouse()
    this.watchKeyboard()
    iohook.start()
  }

  startSwindler() {
    console.log('Start swindling...')
    this.swindler.start()

    const update = () => {
      this.cancelCurrentOCR()
      // console.log('UpdateContext:', this.curContext.id)
      // ensure new
      this.updateState({ context: Object.assign({}, this.curContext) })
    }

    this.swindler.onChange(({ event, message }) => {
      // console.log('Swindler: ', event)
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          this.setCurrentContext(message)
          // if (id === 'Chrome' || id === 'Safari') {
          //   console.log('is a browser')
          // }
          break
        case 'WindowSizeChangedEvent':
          this.resetHighlights()
          this.curContext.bounds = message
          break
        case 'WindowPosChangedEvent':
          this.resetHighlights()
          this.curContext.offset = message
      }

      update()
    })
  }

  setCurrentContext = nextContext => {
    // if given id, reset to new context
    if (nextContext.id) {
      this.curContext = {
        id: nextContext.id,
      }
    }
    const { curContext } = this
    const { id } = curContext
    curContext.title = nextContext.title
    curContext.offset = nextContext.offset
    curContext.bounds = nextContext.bounds
    curContext.appName = id ? id.split('.')[2] : curContext.title
    // adjust for more specifc content area found
    if (this.contentArea) {
      const [x, y, width, height] = this.contentArea
      // divide here for retina
      curContext.offset[0] += x / 2
      curContext.offset[1] += y / 2
      curContext.bounds[0] += width / 2
      curContext.bounds[1] += height / 2
      console.log('adjusting for content area', curContext)
    }
  }

  resetHighlights = () => {
    console.log('reset highlights')
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

  cancelCurrentOCR = () => {
    // cancel next OCR if we have a new context
    clearTimeout(this.nextOCR)
    this.invalidRunningOCR = Date.now()
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
    // no listeners, no need to watch
    // if (!this.hasListeners) {
    //   return
    // }
    // const hasNewOCR = !isEqual(prevState.ocr, this.state.ocr)
    // re-watch on different context
    const firstTimeOCR =
      (!oldState.ocr || !oldState.ocr.length) && newStateItems.ocr
    const newContext = newStateItems.context
    if (newContext || firstTimeOCR) {
      await this.handleNewContext()
    }
  }

  handleNewContext = async () => {
    const { appName, offset, bounds } = this.state.context
    console.log('handleNewContext', appName, { offset, bounds })
    if (!offset || !bounds) {
      console.log('didnt get offset/bounds')
      return
    }

    const appBox = {
      id: APP_ID,
      x: offset[0],
      y: offset[1],
      width: bounds[0],
      height: bounds[1],
      screenDir: this.screenDestination,
      initialScreenshot: true,
      findContent: true,
    }

    // we are watching the whole app for words
    const settings = {
      fps: 10,
      sampleSpacing: 10,
      sensitivity: 2,
      showCursor: false,
      boxes: [appBox],
    }

    console.log('ocr with settings', settings)

    try {
      this.screenOCR.watchBounds(settings)
    } catch (err) {
      console.log('Error starting recorder:', err.message)
      console.log(err.stack)
    }
  }

  stop = () => {
    this.stopped = true
    this.dispose()
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
        console.log('failed to send to socket, removing', err, uid)
        this.removeSocket(uid)
      }
    }
  }

  removeSocket = uid => {
    this.activeSockets = this.activeSockets.filter(s => s.uid !== uid)
  }
}
