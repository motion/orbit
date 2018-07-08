import { react, on } from '@mcro/black'
import { App } from '@mcro/stores'
import { throttle } from 'lodash'
import { AppReactions } from '../../stores/AppReactions'

// some comment test

export default class OrbitStore {
  query = ''

  updateAppQuery = react(
    () => this.query,
    throttle(query => {
      App.setQuery(query)
    }, 32),
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
    this.subscriptions.add({
      dispose: () => {
        console.log('disposing', this.appReactions.id)
        this.appReactions.subscriptions.dispose()
      },
    })
    on(this, window, 'keydown', x => this.handleKeyDown(x.keyCode))
  }

  handleKeyDown = code => {
    console.log('keydown', code)
    const { openSelected, increment, decrement } = this.props.appStore
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
        openSelected()
        return
    }
  }

  setQuery = value => {
    this.query = value
  }

  onChangeQuery = e => {
    this.query = e.target.value
  }

  onFocus = () => {
    App.setOrbitState({
      inputFocused: true,
    })
  }

  onBlur = () => {
    App.setOrbitState({
      inputFocused: false,
    })
  }
}
