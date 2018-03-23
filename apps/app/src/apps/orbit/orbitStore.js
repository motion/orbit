import { react } from '@mcro/black'
import { App } from '@mcro/all'
import KeyboardStore from './keyboardStore'

// const log = debug('OrbitStore')

export default class OrbitStore {
  keyboardStore = new KeyboardStore()
  searchResults = []
  showSettings = false
  indexingStatus = ''
  selectedIndex = 0

  @react({ delay: 64 })
  setAppSelectedIndex = [() => this.selectedIndex, App.setSelectedIndex]

  willMount() {
    // start app reactions
    App.runReactions()

    this.on(this.keyboardStore, 'keydown', code => {
      switch (code) {
        case 40: // down
          this.selectedIndex = Math.min(
            this.results.length - 1,
            this.selectedIndex + 1,
          )
          return
        case 38: //up
          this.selectedIndex = Math.max(0, this.selectedIndex - 1)
          return
        case 13: //enter
          App.setOpenResult(this.results[this.selectedIndex])
          // so hitting enter on a previous app works
          setTimeout(() => {
            App.setOpenResult(null)
          }, 100)
      }
    })
  }

  onChangeQuery = e => {
    App.setQuery(e.target.value)
  }

  setSelectedIndex = index => {
    this.selectedIndex = index
  }

  toggleSettings = () => {
    this.showSettings = !this.showSettings
  }
}
