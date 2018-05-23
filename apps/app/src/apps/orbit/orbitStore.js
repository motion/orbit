import { react } from '@mcro/black'
import { App } from '@mcro/all'
import { throttle } from 'lodash'
import AppReactions from '~/stores/AppReactions'

export default class OrbitStore {
  query = ''

  updateAppQuery = react(
    () => this.query,
    throttle(query => {
      App.setQuery(query)
    }, 32),
    { log: false },
  )

  lastPinKey = ''

  willMount() {
    this.appReactions = new AppReactions({
      onPinKey: key => {
        if (key === 'Delete') {
          this.query = ''
          return
        }
        const { lastPinKey } = this
        if (!lastPinKey || lastPinKey != this.query[this.query.length - 1]) {
          this.query = key
        } else {
          this.query += key
        }
        this.lastPinKey = key
      },
    })
    this.on(window, 'keydown', x => this.handleKeyDown(x.keyCode))
  }

  willUnmount() {
    this.appReactions.subscriptions.dispose()
  }

  handleKeyDown = code => {
    const { results, activeIndex, toggleSelected } = this.props.appStore
    const increment = (by = 1) =>
      toggleSelected(Math.min(results.length - 1, activeIndex + by))
    const decrement = (by = 1) => toggleSelected(Math.max(-1, activeIndex - by))
    switch (code) {
      case 37: // left
        this.emit('key', 'left')
        return
      case 39: // right
        this.emit('key', 'right')
        return
      case 40: // down
        increment()
        return
      case 38: // up
        decrement()
        return
      case 13: // enter
        this.props.appStore.open(results[activeIndex])
        return
    }
  }

  onChangeQuery = e => {
    this.query = e.target.value
  }
}
