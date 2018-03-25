import { react } from '@mcro/black'
import { App } from '@mcro/all'
import KeyboardStore from './keyboardStore'

export default class OrbitStore {
  keyboardStore = new KeyboardStore()
  showSettings = false
  selectedIndex = 0

  @react({ delay: 64 })
  setAppSelectedIndex = [() => this.selectedIndex, App.setSelectedIndex]

  willMount() {
    App.runReactions()
    this.on(this.keyboardStore, 'keydown', this.handleKeyDown)
  }

  handleKeyDown = code => {
    switch (code) {
      case 40: // down
        this.selectedIndex = Math.min(
          App.results.length - 1,
          this.selectedIndex + 1,
        )
        return
      case 38: //up
        this.selectedIndex = Math.max(0, this.selectedIndex - 1)
        return
      case 13: //enter
        App.setOpenResult(App.results[this.selectedIndex])
        // so hitting enter on a previous app works
        setTimeout(() => {
          App.setOpenResult(null)
        }, 100)
    }
  }

  onChangeQuery = e => {
    console.log('changing')
    App.setQuery(e.target.value)
  }

  setSelectedIndex = index => {
    this.selectedIndex = index
  }

  toggleSettings = () => {
    this.showSettings = !this.showSettings
  }
}
