// @flow
import Bridge from './helpers/Bridge'
import { store } from '@mcro/black/store'
import global from 'global'
import App from './App'

const log = debug('Desktop')

type TappState = {
  name: string,
  offset: [Number, Number],
  bounds: [Number, Number],
  screen: [Number, Number],
}

type Word = {
  word: string,
  weight: Number,
  top: Number,
  left: Number,
  width: Number,
  height: Number,
}

export type DesktopState = {
  appState?: TappState,
  ocrWords?: [Word],
  linePositions?: [Number],
  lastOCR: Number,
  lastScreenChange: Number,
  mousePosition: { x: Number, y: Number },
  keyboard: Object,
  highlightWords: { [String]: boolean },
  clearWords: { [String]: Number },
  restoreWords: { [String]: Number },
  pluginResults: [{}],
}

@store
class Desktop {
  state = {
    paused: true,
    pluginResults: [],
    appState: {},
    ocrWords: null,
    linePositions: null,
    lastOCR: Date.now(),
    lastScreenChange: Date.now(),
    mousePosition: { x: 0, y: 0 },
    keyboard: {},
    clearWords: {},
    restoreWords: {},
    selection: null,
  }

  get isHoldingOption(): Boolean {
    const { option, optionUp } = this.state.keyboard
    return option && optionUp && option > (optionUp || 0)
  }

  start(options) {
    Bridge.start(this, this.state, options)
    this.setState = Bridge.setState

    // reactions
    this.openAppOnSelect()
  }

  openAppOnSelect = () => {
    this.react(
      () => App.state.openResult,
      result => {
        console.log('should open result', result)
      },
    )
  }

  updateKeyboard = newState =>
    this.setState({ keyboard: { ...this.state.keyboard, ...newState } })

  // only clear if necessary
  clearOption = () => {
    const { option, optionUp } = this.state
    if (!option || !optionUp || option > optionUp) {
      this.updateKeyboard({ optionUp: Date.now() })
    }
  }
}

const desktop = new Desktop()
global.Desktop = desktop
Bridge.stores.Desktop = desktop

export default desktop
