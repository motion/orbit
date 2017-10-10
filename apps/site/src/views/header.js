import React from 'react'
import { view } from '@mcro/black'

@view
export default class Header {
  render() {
    return (
      <header>
        <img $icon src="/icon.png" />
        <img $logo src="/orbit-logo.svg" />
        <orbital if={false} />
        <space />
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
      width: 30,
      marginBottom: 15,
    },
    logo: {
      width: 85,
    },
    space: {
      height: 500,
      position: 'absolute',
      top: 450,
      right: 0,
      left: 0,
      zIndex: -1,
      pointerEvents: 'none',
      background: 'url(/space.jpg) no-repeat',
      backgroundSize: 'contain',
    },
  }
}
