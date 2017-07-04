import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'

@view.attach('commanderStore')
@view
export default class HomePage {
  componentWillMount() {
    this.props.commanderStore.isOpen = true
  }

  componentWillUnmount() {
    this.props.commanderStore.isOpen = false
  }

  render() {
    if (!User.loggedIn) {
      return <center $$centered>login plz</center>
    }

    return null
  }

  static style = {
    home: {
      flex: 1,
    },
  }
}
