import { on, store } from '@mcro/black'
import { Screen } from '@mcro/screen'
import { Desktop } from '@mcro/stores'

// handles the screen blur window as well as any information relating to the current
// OS screen state like spaces.

@store
export class ScreenManager {
  clearTimeout?: Function
  isStarted = false
  screen: Screen

  constructor({ screen }: { screen: Screen }) {
    this.screen = screen
  }

  start = async () => {
    this.isStarted = true

    // space move
    let mvtm = null
    this.screen.onSpaceMove(() => {
      console.log('got space move...')
      Desktop.setState({ movedToNewSpace: Date.now() })
      clearTimeout(mvtm)
      mvtm = setTimeout(() => {
        this.screen.socketSend('mvsp')
      }, 220)
    })

    // poll for now for space moves...
    const listener = setInterval(() => {
      this.screen.socketSend('space')
    }, 400)
    on(this, listener)
  }
}
