import { react } from '@mcro/black'
import { App } from '@mcro/all'
import { throttle } from 'lodash'

export default class OrbitStore {
  query = ''

  @react
  updateAppQuery = [
    () => this.query,
    throttle(query => {
      App.setQuery(query)
    }, 100),
  ]

  lastPinKey = ''

  willMount() {
    App.runReactions({
      onPinKey: key => {
        console.log('onpinkey', key)
        const { lastPinKey } = this
        if (!lastPinKey || lastPinKey == this.query[this.query.length - 1]) {
          this.query = key
        } else {
          this.query += key
        }
        this.lastPinKey = key
      },
    })
    this.on(window, 'keydown', x => this.handleKeyDown(x.keyCode))
  }

  handleKeyDown = code => {
    const {
      results,
      selectedIndex,
      setSelected,
      showSettings,
    } = this.props.appStore
    const increment = (by = 1) =>
      setSelected(Math.min(results.length - 1, selectedIndex + by))
    const decrement = (by = 1) => setSelected(Math.max(0, selectedIndex - by))
    switch (code) {
      case 37: // left
        if (showSettings) {
          decrement()
        }
        return
      case 39: // right
        if (showSettings) {
          increment()
        }
        return
      case 40: // down
        increment(showSettings ? 2 : 1)
        return
      case 38: //up
        decrement(showSettings ? 2 : 1)
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
    this.query = e.target.value
  }
}
