import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'
import DocPage from './docPage'

@view
export default class HomePage {
  render() {
    if (!User.loggedIn) {
      return <center $$centered>login plz</center>
    }

    if (!User.org) {
      return <null>weird no org</null>
    }

    return <DocPage {...this.props} />
  }
}
