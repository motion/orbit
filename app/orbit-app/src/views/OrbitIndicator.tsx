import { gloss } from '@o/gloss'
import { App, Desktop } from '@o/stores'
import * as UI from '@o/ui'
import * as React from 'react'
import * as Constants from '../constants'

const { SHADOW_PAD } = Constants
const iWidth = 4

const OrbitIndicatorContainer = gloss(UI.View, {
  width: iWidth * 1.5,
  height: iWidth * 6,
  top: 0,
  position: 'absolute',
  background: '#E9B73A',
  transition: `opacity ease-in 70ms 100`,
})

export default function OrbitIndicator({ orbitOnLeft }: { orbitOnLeft: boolean }) {
  if (Date.now() - Desktop.state.lastAppChange < 100) {
    return null
  }
  const border = [1, UI.color('#E9B73A').darken(0.2)]
  return (
    <OrbitIndicatorContainer
      {...{
        border,
        borderRight: orbitOnLeft ? 0 : border,
        borderLeft: !orbitOnLeft ? 0 : border,
        opacity: App.orbitState.docked ? 0 : 1,
        right: orbitOnLeft ? SHADOW_PAD : 'auto',
        left: !orbitOnLeft ? SHADOW_PAD : 'auto',
        borderLeftRadius: orbitOnLeft ? 20 : 0,
        borderRightRadius: !orbitOnLeft ? 20 : 0,
      }}
    />
  )
}
