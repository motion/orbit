import React from 'react'
import { view } from '@mcro/black'
import { User } from '~/app'
import DocumentPage from './document'

@view
export default class HomePage {
  componentDidMount() {
    this.watch(async () => {
      if (User.home === null) {
        await User.createOrg('myneworg')
      }
    })
  }

  render() {
    if (!User.loggedIn) {
      return <center $$centered>login plz</center>
    }

    if (User.home === null) {
      return <null>weird no org</null>
    }

    return <DocumentPage {...this.props} />
  }
}
