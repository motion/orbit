import Path from 'path'
import { Server } from 'ws'
import Screen from '@mcro/screen'
import ocr from '@mcro/ocr'
import getContext from './helpers/getContext'
import { isEqual, throttle } from 'lodash'
import mouse from 'osx-mouse'

const sleep = ms => new Promise(res => setTimeout(res, ms))

const DEBOUNCE_OCR = 1000
const OCR_TMP_DIR = Path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '@mcro',
  'ocr',
  'tmp',
  'screen.png',
)

export default class ScreenState {
  stopped = false
  invalidRunningOCR = Date.now()
  hasNewOCR = false
  runningOCR = false
  screenDestination = OCR_TMP_DIR
  video = new Screen()
  wss = new Server({ port: 40510 })
  activeSockets = []
  id = 0
  nextOCR = null

  state = {
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
      console.log('error sending over socket', err)
    }
  }

  onChangedState = async newStateItems => {
    // no listeners, no need to watch
    if (!this.hasListeners) {
      return
    }
    // const hasNewOCR = !isEqual(prevState.ocr, this.state.ocr)
    // re-watch on different context
    if (newStateItems.context) {
      await this.watchScreen()
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

  watchScreen = async () => {
    const { appName, offset, bounds } = this.state.context
    console.log('watchScreen', appName, { offset, bounds })
    if (!offset || !bounds) {
      console.log('didnt get offset/bounds')
      return
    }
    const settings = {
      destination: this.screenDestination,
      fps: this.state.ocr ? 30 : 2,
      sampleSpacing: 10,
      sensitivity: 2,
      showCursor: false,
      cropArea: {
        x: offset[0],
        y: offset[1],
        width: bounds[0],
        height: bounds[1],
      },
    }
    await this.video.stopRecording()
    this.video.startRecording(settings)

    // start a debounced ocr
    this.handleChangedFrame()
    // start watching for diffs too
    this.video.onChangedFrame(this.handleChangedFrame)
  }

  handleChangedFrame = async () => {
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
    const ocr = await this.ocr()
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

  async ocr() {
    if (!this.state.context) {
      return
    }
    console.log('running ocr', this.state.context)
    const { offset } = this.state.context
    if (!offset) {
      return
    }
    try {
      // TODO debug why tesseract doesnt like the dpi on our swift screens
      const res = await ocr({ inputFile: this.screenDestination })
      // const res = await ocr({ offset, bounds, takeScreenshot: true })
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
