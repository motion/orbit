import BaseComponent from './BaseComponent'

const EVENT_KEYS = {
  onReady: 'on-ready',
  onBeforeQuit: 'on-before-quit',
}

export default class App extends BaseComponent {
  handleNewProps(keys) {
    for (const key of keys) {
      const val = this.props[key]
      if (EVENT_KEYS[key]) {
        this.handleEvent(this.root.app, EVENT_KEYS[key], val)
        continue
      }
    }
  }
}
