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

export default class ScreenState {
  screenDestination = OCR_TMP_DIR
  currentApp = {}
  lastChangeTime = Date.now()
  video = new Screen()
  wss = new Server({ port: 40510 })
  actions = {
    start: this.start,
    stop: this.stop,
  }

  state = {
    context: null,
    ocr: null,
    lastScreenChange: Date.now(),
  }

  constructor() {
    this.wss.on('connection', socket => {
      socket.on('message', str => {
        const { action, value } = JSON.parse(str)
        console.log('received', action, value)
        if (this.actions[action]) {
          this.actions[action](value)
        }
      })

      socket.on('error', () => {
        console.log('error')
      })

      this.socketSend = socket.send.bind(socket)
    })

    this.wss.on('error', (...args) => {
      console.log('wss error', args)
    })
  }

  start() {
    this.watchApplication(async context => {
      this.updateState({ context })
    })
  }

  updateState(object) {
    const nextState = { ...this.state, ...object }
    if (isEqual(nextState, this.state)) {
      return
    }
    this.state = nextState
    if (!this.socketSend) {
      return
    }
    this.onChangedState()
    this.socketSend(JSON.stringify(this.state))
  }

  async onChangedState() {
    await this.watchScreen()
  }

  async watchApplication(cb) {
    const context = await getContext()
    await cb(context)
    this.watchApplication(cb)
  }

  async watchScreen() {
    const { offset, bounds } = this.state.context
    const settings = {
      destination: this.screenDestination,
      fps: this.state.ocr ? 30 : 2,
      cropArea: {
        x: offset[0],
        y: offset[1],
        width: bounds[0],
        height: bounds[1],
      },
    }
    console.log('running ocr with settings', settings)
    await this.video.stopRecording()
    await sleep(100)
    this.video.startRecording(settings)
    this.video.onChangedFrame(this.handleChange)
  }

  handleChange = () => {
    clearTimeout(this.ocrTimeout)
    const delay = this.results ? DEBOUNCE_OCR : 0
    // delays taking OCR for no movement
    this.ocrTimeout = setTimeout(this.runOCR, delay)
    this.updateState({
      lastScreenChange: Date.now(),
    })
  }

  runOCR = async () => {
    if (this.runningOCR) {
      this.shouldRunAgain = true
      return
    }
    this.runningOCR = true
    const ocr = await this.ocr()
    console.log('ocr', ocr)
    this.runningOCR = false
    console.log('got ocr', ocr)
    this.updateState({ ocr })
  }

  stopDiff() {
    this.video.stopRecording()
  }

  async ocr() {
    if (!this.state.context) {
      return
    }
    console.log('running ocr', this.state.context)
    const { offset, bounds } = this.state.context
    if (!offset || !bounds) {
      return
    }
    try {
      // TODO debug why tesseract doesnt like the dpi on our swift screens
      const res = await ocr({ inputFile: this.screenDestination })
      // const res = await ocr({ offset, bounds, takeScreenshot: true })
      console.log('got', res)
      const { boxes } = res
      return boxes.map(({ name, weight, box }) => {
        const left = offset[0] + box[0]
        const topOffset = 24
        const top = offset[1] + box[1] - topOffset
        const width = offset[0] + box[2] - left
        const height = offset[1] + box[3] - top - topOffset
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
