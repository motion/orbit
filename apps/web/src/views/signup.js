// @flow
import React from 'react'
import { view } from '@mcro/black'
import { CurrentUser } from '~/app'
import Login from '~/apps/panes/login'

@view
export default class Signup {
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
