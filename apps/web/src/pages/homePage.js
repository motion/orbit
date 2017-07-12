import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'

@view.attach('explorerStore')
@view
export default class HomePage {
  render() {
    if (!User.loggedIn) {
      return <center $$centered>login plz</center>
    }

    return <home>welcome home</home>
  }

  static style = {
    home: {
      flex: 1,
    },
  }
}
