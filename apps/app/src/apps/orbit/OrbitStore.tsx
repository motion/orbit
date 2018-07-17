import { react, on } from '@mcro/black'
import { App } from '@mcro/stores'
import { throttle } from 'lodash'
import { AppReactions } from '../../stores/AppReactions'
import initNlp from './nlpWorker'

const { parseSearchQuery } = initNlp()

console.log(parseSearchQuery, initNlp())

// some comment test

export class OrbitStore {
  query = App.state.query

  nlp = react(
    () => this.query,
    async (query, { sleep }) => {
      await sleep(40)
      return await parseSearchQuery(query)
    },
    { immediate: true },
  )

  get highlightWords() {
    if (!this.nlp) {
      return null
    }
    const highlights = this.nlp.highlights
    return () => highlights
  }

  updateAppQuery = react(
    () => this.query,
    throttle(query => {
      App.setQuery(query)
    }, 32),
  )

  clearQuery = () => {
    this.query = ''
  }

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
    on(this, window, 'keydown', this.handleKeyDown)
  }

  handleKeyDown = ({ keyCode }) => {
    const { openSelected, increment, decrement } = this.props.appStore
    switch (keyCode) {
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
