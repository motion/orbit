import { Server } from 'ws'
import screen from '@mcro/screen'

const DEFAULT_SETTINGS = {
  fps: 30,
  cropArea: {
    x: 20,
    y: 0,
    width: 200,
    height: 200,
  },
}

export default class ScreenState {
  constructor() {
    this.video = screen()
  }

  start(settings = DEFAULT_SETTINGS) {
    this.video.startRecording(settings)

    this.wss = new Server({ port: 40510 })
    this.wss.on('connection', socket => {
      socket.on('message', message => {
        console.log('received: %s', message)
      })

      this.video.onChangedFrame(() => {
        socket.send(`changed`)
      })
    })
  }

  stop() {
    this.video.stopRecording()
  }
}
