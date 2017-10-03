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
        <orbital />
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
      // maxWidth: 800,
      // width: '100%',
      // margin: [0, 'auto'],
    },
    icon: {
      width: 60,
      marginBottom: 40,
    },
    logo: {
      width: 90,
    },
    orbital: {
      width: 2000,
      height: 2000,
      position: 'absolute',
      top: -1000,
      right: -400,
      border: [1, [0, 0, 0, 0.1]],
      borderRadius: 100000000,
      zIndex: 0,
      pointerEvents: 'none',
    },
  }
}
