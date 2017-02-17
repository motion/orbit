// @flow
import React from 'react'
import view from 'my-view'

class Store {
  x = 1
}

@view.provide({
  test: Store
})
export default class Main {
  componentDidMount() {
    this.addEvent(window, 'mousemove', console.log)
  }

  render(a) {
    return (
      <h1>Hello {this.test.x}</h1>
    )
  }

  static style = {
    h1: {
      background: 'blue'
    }
  }
}
