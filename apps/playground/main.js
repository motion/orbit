// @flow
import React from 'react'
import { view } from '@jot/black'
import { Theme, Button } from '@jot/ui'

class Playground extends React.Component {
  render() {
    return <Button>Hello World</Button>
  }
}

export default class Main extends React.Component {
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
