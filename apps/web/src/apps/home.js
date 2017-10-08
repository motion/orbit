import React from 'react'
import { view } from '@mcro/black'
import { CurrentUser } from '~/app'

@view
export default class HomePage extends React.Component {
  render() {
    if (!CurrentUser.loggedIn) {
      return <center $$centered>login plz</center>
    }

    if (CurrentUser.home === null) {
      return <null>weird no org</null>
    }

    return <home $$centered>... home ...</home>
  }
}
