import { App } from '@mcro/all'
import KeyboardStore from './keyboardStore'

export default class OrbitStore {
  keyboardStore = new KeyboardStore()

  willMount() {
    // only do reactions in one App
    App.runReactions()
    this.on(this.keyboardStore, 'keydown', this.handleKeyDown)
  }

  handleKeyDown = code => {
    const { results, selectedIndex, setSelectedIndex } = this.props.appStore
    switch (code) {
      case 40: // down
        setSelectedIndex(Math.min(results.length - 1, selectedIndex + 1))
        return
      case 38: //up
        setSelectedIndex(Math.max(0, selectedIndex - 1))
        return
      case 13: //enter
        App.setOpenResult(results[selectedIndex])
        // so hitting enter on a previous app works
        setTimeout(() => {
          App.setOpenResult(null)
        }, 100)
    }
  }

  onChangeQuery = e => {
    App.setQuery(e.target.value)
  }
}
