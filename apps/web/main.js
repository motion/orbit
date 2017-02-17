// @flow
import React from 'react'
import view from 'motion-test-view'

class Store {
  x = 1
}

@view
export default class Main {
  componentDidMount() {
    this.addEvent(window, 'click', console.log)
  }

  render(a) {
    return (
      <h1>
        Hello2222 {this.test}
        <Sub />
      </h1>
    )
  }

  static style = {
    h1: {
      background: 'blue'
    }
  }
}


@view.provide({
  store: Store,
})
class Sub {
  render() {
    console.log('gpot', this.test, this.store.x)
    return null
  }
}
