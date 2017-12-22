import { Server } from 'ws'
import screen from '@mcro/screen'
import ocr from '@mcro/ocr'
import getContext from './helpers/getContext'
import { isEqual } from 'lodash'

const sleep = ms => new Promise(res => setTimeout(res, ms))

const DEFAULT_SETTINGS = {
  fps: 30,
  cropArea: {
    x: 20,
    y: 0,
    width: 200,
    height: 200,
  },
}

// send { action, value } to interact
export default class ScreenState {
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

  handleChange = () => {
    if (this.sendChange) {
      this.sendChange(`changed`)
    } else {
      console.log('No connected app to send change to')
    }
  }

  start() {
    let currentApp = null
    this.watchApplication(async nextApp => {
      if (!isEqual(currentApp, nextApp)) {
        currentApp = nextApp
        const { appName, offset, bounds } = nextApp
        console.log('watching', appName)
        await this.watchScreen({
          destination: '/tmp/screen.png',
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
    console.log('starting with settings', settings)
    await this.video.stopRecording()
    await sleep(100)
    this.video.startRecording(settings)
    this.video.onChangedFrame(this.handleChange)
  }

  stopDiff() {
    this.video.stopRecording()
  }

  async ocr() {
    console.log('running ocr', this.options)
    const { offset, bounds } = this.options
    if (!offset || !bounds) {
      await sleep(100)
      return
    }
    try {
      const res = await ocr(this.options)
      console.log('got', res)
      const { boxes } = res
      this.results = boxes.map(({ name, weight, box }) => {
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
