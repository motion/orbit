// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { CurrentUser } from '~/app'
import Login from '~/apps/panes/login'

@view
export default class Signup extends React.Component<> {
  static defaultProps: {}

  render() {
    return (
      <signup if={!CurrentUser.loggedIn} $$fullscreen $$draggable $$centered>
        <Login />
      </signup>
    )
  }

  static style = {
    signup: {
      background: 'radial-gradient(#fff, #eee)',
      zIndex: 11,
    },
  }
}
