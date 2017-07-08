import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'

@view.attach('explorerStore')
@view
export default class HomePage {
  componentWillMount() {
    this.props.explorerStore.isOpen = true
  }

  componentWillUnmount() {
    this.props.explorerStore.isOpen = false
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
