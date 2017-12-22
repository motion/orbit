import { Server } from 'ws'
import screen from '@mcro/screen'
import ocr from '@mcro/ocr'
import getContext from './helpers/getContext'
import { isEqual } from 'lodash'

const sleep = ms => new Promise(res => setTimeout(res, ms))

// send { action, value } to interact
export default class ScreenState {
  screenDestination = '/tmp/screen.png'
  currentApp = {}

  constructor() {
    this.video = screen()
    this.wss = new Server({ port: 40510 })

    this.actions = {
      start: this.start,
      stop: this.stop,
    }

    this.wss.on('connection', socket => {
      socket.on('message', str => {
        const { action, value } = JSON.parse(str)
        console.log('received', action, value)
        if (this.actions[action]) {
          this.actions[action](value)
        }
      })
      this.sendChange = (object = null) => {
        socket.send(JSON.stringify(object))
      }
    })
  }

  handleChange = async () => {
    const results = await this.ocr()

    console.log('got results', results)

    if (this.sendChange) {
      this.sendChange(`changed`)
    } else {
      console.log('No connected app to send change to')
    }
  }

  start() {
    this.watchApplication(async nextApp => {
      if (!isEqual(this.currentApp, nextApp)) {
        this.currentApp = nextApp
        const { appName, offset, bounds } = nextApp
        console.log('i see', appName)
        await this.watchScreen({
          destination: this.screenDestination,
          fps: 10,
          cropArea: {
            x: offset[0],
            y: offset[1],
            width: bounds[0],
            height: bounds[1],
          },
        })
      }
    })
  }

  async watchApplication(cb) {
    const context = await getContext()
    await cb(context)
    this.watchApplication(cb)
  }

  async watchScreen(settings) {
    await this.video.stopRecording()
    await sleep(100)
    this.video.startRecording(settings)
    this.video.onChangedFrame(this.handleChange)
  }

  stopDiff() {
    this.video.stopRecording()
  }

  async ocr() {
    console.log('running ocr', this.currentApp)
    const { offset, bounds } = this.currentApp
    if (!offset || !bounds) {
      return
    }
    try {
      // TODO debug why tesseract doesnt like the dpi on our swift screens
      // const res = await ocr({ inputFile: this.screenDestination })
      const res = await ocr({ offset, bounds, takeScreenshot: true })
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
