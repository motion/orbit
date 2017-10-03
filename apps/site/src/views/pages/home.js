import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const Text = props => (
  <UI.Text
    size={1.5}
    lineHeight="2.2rem"
    marginBottom={20}
    color={[0, 0, 0, 0.5]}
    {...props}
  />
)

const Hl = props => <UI.Text {...props} />

@view
export default class HomePage {
  render() {
    return (
      <page>
        <Text>Hello,</Text>

        <Text>
          We're a Founders Fund startup working on an app to solve your{' '}
          <Hl>internal ops</Hl> as good or better than Stripe & Facebook.
        </Text>

        <Text>
          We're just about ready to start a beta, so here's a simple page to
          explain our strategy.
        </Text>
      </page>
    )
  }

  static style = {
    page: {
      width: '80%',
      minWidth: 300,
      maxWidth: 500,
      margin: [0, 'auto'],
    },
  }
}
