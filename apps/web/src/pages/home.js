import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'
import DocumentPage from './document'

@view
export default class HomePage {
  render() {
    if (!User.loggedIn) {
      return <center $$centered>login plz</center>
    }

    if (User.orgs && User.orgs.length === 0) {
      log('MAKE TAHT FUCKING ORG')
      User.createOrg('Welcome')
      return <null>weird no org</null>
    }

    return <DocumentPage {...this.props} />
  }
}
