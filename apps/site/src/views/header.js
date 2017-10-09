import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Header {
  render() {
    return (
      <header>
        <img $icon src="/icon.png" />
        <img $logo src="/orbit-logo.svg" />
        <orbital />
      </header>
    )
  }

  static style = {
    header: {
      position: 'relative',
      background: 'transparent',
      padding: [50, 10, 0],
      alignItems: 'center',
      justifyContent: 'center',
      // maxWidth: 800,
      // width: '100%',
      // margin: [0, 'auto'],
    },
    icon: {
      width: 36,
      marginBottom: 20,
    },
    logo: {
      width: 90,
    },
    orbital: {
      width: 2000,
      height: 2000,
      position: 'absolute',
      top: -1400,
      right: -400,
      border: [2, '#EFEDFF'],
      borderRadius: 100000000,
      zIndex: -1,
      pointerEvents: 'none',
      background: 'linear-gradient(#fff, #FDFDFF)',
    },
  }
}
