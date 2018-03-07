// @flow
import Bridge from './Bridge'
import { store } from '@mcro/black/store'
import global from 'global'

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
  restoreWords: { [String]: Numbe },
}

@store
class Desktop {
  get setState() {
    log('setState')
    return Bridge._setState
  }

  state = {
    paused: null,
    appState: null,
    ocrWords: null,
    linePositions: null,
    lastOCR: null,
    lastScreenChange: null,
    mousePosition: {},
    keyboard: {},
    clearWords: {},
    restoreWords: {},
    // some test highlight words
    highlightWords: {},
  }

  start(...args) {
    return Bridge.start(this, this.state, ...args)
  }

  get isHoldingOption() {
    return this.state.keyboard.option > this.state.keyboard.optionUp
  }
}

const desktop = new Desktop()
global.Desktop = desktop

console.log('desktop', desktop)

export default desktop
