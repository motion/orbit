import BaseComponent from './BaseComponent'

const EVENT_KEYS = {
  onReadyToShow: 'ready-to-show',
  onReady: 'on-ready',
  onBeforeQuit: 'on-before-quit',
  onClose: 'close',
  onClosed: 'closed',
  onBlur: 'blur',
  onFocus: 'focus',
}

export default class App extends BaseComponent {
  handleNewProps(keys) {
    for (const key of keys) {
      const val = this.props[key]
      if (EVENT_KEYS[key]) {
        this.handleEvent(this.root.app, EVENT_KEYS[key], val)
      }
    }
  }
}
