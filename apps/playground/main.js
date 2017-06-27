// @flow
import React from 'react'
import { view } from '@jot/black'
import { Theme, Button } from '@jot/ui'

@view
class Playground {
  render() {
    return (
      <playground>
        <section $buttons>
          <Button icon="world">Hello World</Button>
          <Button icon="world" size={2}>Hello World</Button>
          <Button color="red" background="blue">Hello World</Button>
        </section>
      </playground>
    )
  }
}

@view
export default class Main {
  render() {
    return (
      <main>
        <Playground />
        <Theme name="light">
          <Playground />
        </Theme>
        <Theme name="dark">
          <Playground />
        </Theme>
      </main>
    )
  }
}
