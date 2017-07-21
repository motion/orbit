import React from 'react'
import { view } from '@mcro/black'
import { User } from '~/app'
import DocumentPage from './document'

@view
export default class HomePage {
  render() {
    if (!User.loggedIn) {
      return <center $$centered>login plz</center>
    }

    if (User.home === null) {
      log('MAKE TAHT FUCKING ORG')
      User.createOrg('myneworg')
      return <null>weird no org</null>
    }

    return <DocumentPage {...this.props} />
  }
}
