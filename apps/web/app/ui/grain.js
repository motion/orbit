import React from 'react'
import { view } from '@jot/black'

@view.ui
export default class Grain {
  render() {
    return <grain $$fullscreen />
  }

  static style = {
    grain: {
      background: 'url(/images/grain.png)',
      zIndex: 0,
      opacity: 0.25,
      pointerEvents: 'none',
    },
  }
}
