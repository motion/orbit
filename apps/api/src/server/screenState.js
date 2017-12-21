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
    this.wss = new Server({ port: 40510 })

    this.wss.on('connection', socket => {
      socket.on('message', message => {
        console.log('received: %s', message)
      })
      this.sendChange = () => socket.send('changed')
    })
  }

  start(settings = DEFAULT_SETTINGS) {
    console.log('starting with settings', settings)
    this.video.startRecording(settings)
    this.video.onChangedFrame(() => {
      this.sendChange(`changed`)
    })
  }

  stop() {
    this.video.stopRecording()
  }
}
