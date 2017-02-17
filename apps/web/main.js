// @flow
import React from 'react'
import view from 'motion-test-view'

class Store {
  x = 1
}

@view.inject({
  test: 10
})
export default class Main {
  componentDidMount() {
    // this.addEvent(window, 'mousemove', console.log)
    console.log(this)
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


@view.provide('test')
class Sub {
  render() {
    console.log('gpot', this.test)
    return null
  }
}
