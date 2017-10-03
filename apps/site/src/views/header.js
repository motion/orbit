import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Header {
  render() {
    return <header>123</header>
  }

  static style = {
    header: {
      position: 'relative',
      background: 'transparent',
      zIndex: 500,
      padding: [0, 10],
      flexFlow: 'row',
      alignItems: 'center',
      transition: 'all ease-out 300ms',
      transitionDelay: '400ms',
    },
  }
}
