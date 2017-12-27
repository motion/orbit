// @flow
import Path from 'path'
import { Server } from 'ws'
import Screen from '@mcro/screen'
import ocrScreenshot from '@mcro/ocr'
import getContext from './helpers/getContext'
import { isEqual, throttle } from 'lodash'
import mouse from 'osx-mouse'
import * as Constants from '~/constants'

const APP_ID = 'screen'
const DEBOUNCE_OCR = 1000

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
}

export default class ScreenState {
  stopped = false
  invalidRunningOCR = Date.now()
  hasNewOCR = false
  runningOCR = false
  screenDestination = Constants.TMP_DIR
  video = new Screen()
  wss = new Server({ port: 40510 })
  activeSockets = []
  id = 0
  nextOCR = null

  state: TScreenState = {
    context: null,
    ocr: null,
    lastOCR: Date.now(),
    lastScreenChange: Date.now(),
    mousePosition: [0, 0],
  }

  constructor() {
    this.wss.on('connection', socket => {
      let uid = this.id++
      socket.on('message', str => {
        const { action, value } = JSON.parse(str)
        if (this[action]) {
          console.log('received action:', action)
          this[action].call(this, value)
        }
      })
      socket.on('close', () => {
        this.removeSocket(uid)
      })
      socket.on('error', (...args) => {
        console.log('error', ...args)
        this.removeSocket(uid)
      })
      this.activeSockets.push({ uid, socket })
    })
    this.wss.on('close', () => {
      console.log('WE SHOULD HANDLE THIS CLOSE', ...arguments)
    })
    this.wss.on('error', (...args) => {
      console.log('wss error', args)
    })
  }

  get hasListeners() {
    return this.activeSockets.length
  }

  start = () => {
    this.watchMouse()
    this.stopped = false
    this.watchApplication(async context => {
      if (!isEqual(this.state.context, context)) {
        console.log('new context, invalidate ocr')
        console.log('old contet', this.state.context)
        console.log('new contet', context)
        this.cancelCurrentOCR()
        this.updateState({ context })
      }
    })
  }

  watchMouse = () => {
    this.mouse = mouse()
    this.mouse.on(
      'move',
      throttle((x, y) => {
        this.updateState({
          mousePosition: [x, y],
        })
      }, 32),
    )
  }

  cancelCurrentOCR = () => {
    // cancel next OCR if we have a new context
    clearTimeout(this.nextOCR)
    this.invalidRunningOCR = Date.now()
  }

  updateState = object => {
    if (this.stopped) {
      return
    }
    let hasNewState
    for (const key of Object.keys(object)) {
      if (!isEqual(this.state[key], object[key])) {
        hasNewState = true
        break
      }
    }
    if (!hasNewState) {
      return
    }
    this.state = { ...this.state, ...object }
    this.onChangedState(object)
    try {
      // only send the changed things to reduce overhead
      this.socketSend(object)
    } catch (err) {
      console.log('error sending over socket', err.message)
    }
  }

  onChangedState = async newStateItems => {
    // no listeners, no need to watch
    if (!this.hasListeners) {
      return
    }
    // const hasNewOCR = !isEqual(prevState.ocr, this.state.ocr)
    // re-watch on different context
    if (newStateItems.context || newStateItems.ocr) {
      await this.handleNewContext()
    }
  }

  watchApplication = async cb => {
    const context = await getContext()
    await cb(context)
    if (this.stopped) {
      return
    }
    this.watchApplication(cb)
  }

  handleNewContext = async () => {
    const { appName, offset, bounds } = this.state.context

    // test
    if (appName !== 'Simplenote') {
      console.log('not simplenote')
      return
    }

    console.log('watchScreen', appName, { offset, bounds })
    if (!offset || !bounds) {
      console.log('didnt get offset/bounds')
      return
    }

    await this.video.stopRecording()

    const appBox = {
      id: APP_ID,
      x: offset[0],
      y: offset[1],
      width: bounds[0],
      height: bounds[1],
      screenDir: this.screenDestination,
    }

    let settings
    const { ocr } = this.state

    // watch settings
    if (!ocr) {
      // we are watching the whole app for words
      settings = {
        fps: ocr ? 30 : 2,
        sampleSpacing: 10,
        sensitivity: 2,
        showCursor: false,
        boxes: [appBox],
      }
    } else {
      const boxes = [
        ...ocr.map(({ word, top, left, width, height }) => {
          return {
            id: word,
            x: left,
            y: top,
            width,
            height,
            screenDir: this.screenDestination,
          }
        }),
      ]
      // watch just the words to see clears
      settings = {
        fps: 30,
        sampleSpacing: 10,
        sensitivity: 1,
        // show cursor for now to test
        showCursor: true,
        boxes,
      }
    }

    console.log('settings', settings)

    this.video.startRecording(settings)

    // start a debounced ocr
    this.handleChangedFrame()
    // start watching for diffs too
    this.video.onChangedFrame(this.handleChangedFrame)
  }

  handleChangedFrame = async wordId => {
    if (this.state.ocr) {
      if (!wordId) {
        console.log('no word given in change event, but we have ocrs')
      } else {
        console.log('got a change for word', wordId)
      }
    }
    clearTimeout(this.nextOCR)
    if (this.stopped) {
      return
    }
    if (Date.now() - this.hasNewOCR < 1000) {
      console.log('ocr happened recently so ignore frame diff')
      return
    }
    // this cancels running ocr due to frame change before scheduling next
    if (this.runningOCR) {
      this.cancelCurrentOCR()
    }
    // delays taking OCR for no movement
    this.nextOCR = setTimeout(this.runOCR, DEBOUNCE_OCR)
    this.updateState({
      lastScreenChange: Date.now(),
    })
  }

  runOCR = async () => {
    if (this.runningOCR) {
      console.log('already running ocr, todo: make this wait or something')
      return
    }
    console.log('runOCR')
    let resolveRunningOCR
    this.runningOCR = new Promise(res => {
      resolveRunningOCR = res
    })
    const dateStarted = Date.now()
    const ocr = await this.getOCR()
    console.log('runOCR highlights length:', ocr && ocr.length)
    resolveRunningOCR()
    this.runningOCR = null
    if (this.invalidRunningOCR > dateStarted) {
      console.log('app has changed since this ocr, invalid')
      return
    }
    this.hasNewOCR = Date.now()
    this.updateState({ ocr, lastOCR: Date.now() })
  }

  stop = () => {
    console.log('RECEIVING STOP')
    this.stopped = true
    if (this.video) {
      this.video.stopRecording()
    }
  }

  async getOCR() {
    if (!this.state.context) {
      return
    }
    console.log('running ocr', this.state.context)
    const { offset } = this.state.context
    if (!offset) {
      return
    }
    try {
      const res = await ocrScreenshot({
        inputFile: Path.join(this.screenDestination, `${APP_ID}.png`),
      })
      const { boxes } = res
      const [screenX, screenY] = offset
      return boxes.map(({ name, weight, box }) => {
        // box => [x, y, width, height]
        // console.log('box', name, box)
        const [x, y, wWidth, wHeight] = box
        const left = screenX + x
        const topOffset = 24
        const top = screenY + y - topOffset
        const width = screenX + wWidth - left
        const height = screenY + wHeight - top - topOffset
        return {
          word: name,
          weight,
          top,
          left,
          width,
          height,
        }
      })
    } catch (err) {
      console.log('error with ocr', err.message, err.stack)
    }
  }

  socketSend = data => {
    const strData = JSON.stringify(data)
    for (const { socket } of this.activeSockets) {
      socket.send(strData)
    }
  }

  removeSocket = uid => {
    this.activeSockets = this.activeSockets.filter(s => (s.uid = uid))
  }

  dispose() {
    this.stopDiff()
    this.mouse.destroy()
  }
}
