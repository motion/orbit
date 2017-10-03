import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Header {
  render() {
    return (
      <header>
        <img $icon src="/orbit.svg" />
        <img $logo src="/orbit-logo.svg" />
      </header>
    )
  }

  static style = {
    header: {
      position: 'relative',
      background: 'transparent',
      padding: [80, 10, 50],
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 60,
      marginBottom: 40,
    },
    logo: {
      width: 100,
    },
  }
}
