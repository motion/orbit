// @flow
import Screen from './Screen'
import { store } from '@mcro/black/store'
import global from 'global'

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
  get state(): DesktopState {
    return Screen.desktopState
  }

  get setState() {
    return Screen._setState
  }

  get isHoldingOption() {
    return this.state.keyboard.option > this.state.keyboard.optionUp
  }
}

const desktop = new Desktop()
global.Desktop = desktop

export default desktop
