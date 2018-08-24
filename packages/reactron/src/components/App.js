import { BaseComponent } from './BaseComponent'

const EVENT_KEYS = {
  onReady: 'on-ready',
  onBeforeQuit: 'on-before-quit',
  onWillQuit: 'will-quit',
  onQuit: 'quit',
}

export class App extends BaseComponent {
  mount() {
    this.app = this.root.app
    this.update()
  }

  handleNewProps(keys) {
    for (const key of keys) {
      const val = this.props[key]
      if (EVENT_KEYS[key]) {
        this.handleEvent(this.root.app, EVENT_KEYS[key], val)
      }
      if (key === 'path') {
        this.app.setPath(val)
      }
      if (key === 'devTools') {
        const installer = require('electron-devtools-installer')
        for (const tool of val) {
          installer(tool)
        }
      }
    }
  }
}
