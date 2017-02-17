// @flow
import React from 'react'
import view from 'motion-test-view'

class Store {
  x = 1
}

@view.inject({
  test: 10
})
export default class Main extends React.Component {
  constructor() {
    super()
    console.log('called main constructor')
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


@view.provide('test', {
  store: Store,
})
class Sub {
  render() {
    console.log('gpot', this.test, this.store.x)
    return null
  }
}
