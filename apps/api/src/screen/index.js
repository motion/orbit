import Path from 'path'
import { Server } from 'ws'
import Screen from '@mcro/screen'
import ocr from '@mcro/ocr'
import getContext from './helpers/getContext'
import { isEqual } from 'lodash'

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

let id = 0

export default class ScreenState {
  stopped = false
  invalidateRunningOCR = false
  hasNewOCR = false
  runningOCR = false
  screenDestination = OCR_TMP_DIR
  currentApp = {}
  lastChangeTime = Date.now()
  video = new Screen()
  wss = new Server({ port: 40510 })
  activeSockets = []

  state = {
    context: null,
    ocr: null,
    lastScreenChange: Date.now(),
  }

  constructor() {
    this.wss.on('connection', socket => {
      let uid = id++

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

  socketSend = data => {
    for (const { socket } of this.activeSockets) {
      socket.send(data)
    }
  }

  removeSocket = uid => {
    this.activeSockets = this.activeSockets.filter(s => (s.uid = uid))
  }

  start = () => {
    this.stopped = false
    this.watchApplication(async context => {
      this.updateState({ context })
    })
  }

  updateState = object => {
    if (this.stopped) {
      return
    }
    const nextState = { ...this.state, ...object }
    if (isEqual(nextState, this.state)) {
      return
    }
    const prevState = this.state
    this.state = nextState
    this.onChangedState(prevState)
    if (!this.socketSend) {
      return
    }
    try {
      this.socketSend(JSON.stringify(this.state))
    } catch (err) {
      console.log('error sending over socket', err)
    }
  }

  onChangedState = async prevState => {
    const hasNewContext = !isEqual(prevState.context, this.state.context)
    const hasNewOCR = !isEqual(prevState.ocr, this.state.ocr)
    // re-watch on different context or ocr
    if (hasNewContext || hasNewOCR) {
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
    this.video.onChangedFrame(this.handleChangedFrame)
  }

  handleChangedFrame = () => {
    if (this.stopped) {
      return
    }
    clearTimeout(this.ocrTimeout)
    const delay = this.results ? DEBOUNCE_OCR : 0
    // delays taking OCR for no movement
    this.ocrTimeout = setTimeout(this.runOCR, delay)
    if (this.hasNewOCR) {
      this.hasNewOCR = false
      console.log('we just drew the ocr results, so ignore this frame diff')
      return
    }
    if (this.runningOCR) {
      console.log('running ocr, should invalidate but lets not for now')
      // this.invalidateRunningOCR = true
    }
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
    this.runningOCR = true
    const ocr = await this.ocr()
    console.log('runOCR highlights length:', ocr && ocr.length)
    this.runningOCR = false
    if (this.invalidateRunningOCR) {
      console.log('app has changed since this ocr')
      return
    }
    this.hasNewOCR = true
    this.updateState({ ocr })
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
        console.log('box', name, box)
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

  dispose() {
    this.stopDiff()
  }
}
