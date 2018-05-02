import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import * as Constants from '~/constants'

const { SHADOW_PAD } = Constants

@view
export default class OrbitArrow {
  render({ borderColor, background, orbitOnLeft, arrowSize, css }) {
    let arrowStyle
    if (orbitOnLeft) {
      arrowStyle = {
        top: 49,
        right: SHADOW_PAD - arrowSize,
      }
    } else {
      arrowStyle = {
        top: 49,
        left: 3,
      }
    }
    let arrowTransformY
    if (App.state.hoveredWord) {
      const { top } = App.state.hoveredWord
      const orbitY = App.orbitState.position[1]
      const orbitH = App.orbitState.size[1]
      const arrowMinY = orbitY + 40
      const arrowMaxY = orbitY + orbitH - 40
      const offsetY = Math.min(arrowMaxY, Math.max(arrowMinY, top - orbitY))
      arrowTransformY = offsetY - arrowStyle.top
    }
    const ms = App.animationDuration
    return (
      <UI.Arrow
        size={arrowSize}
        towards={App.orbitArrowTowards}
        background={background}
        boxShadow={[['inset', 0, 0, 0, 0.5, borderColor.darken(0.1)]]}
        // border={[1, '#000']}
        css={{
          position: 'absolute',
          ...arrowStyle,
          zIndex: 1000000000,
          transition: App.isShowingOrbit
            ? `
              opacity ease-out ${ms * 0.5},
              transform ease-out ${ms * 0.8}ms
            `
            : `
              opacity ease-in ${ms * 0.5}ms ${ms * 0.6}ms,
              transform ease-in 180ms
            `,
          opacity: App.isShowingOrbit ? 1 : 0,
          transform: {
            y: arrowTransformY || 0,
            x: App.isShowingOrbit
              ? orbitOnLeft ? -0.5 : 0.5
              : (orbitOnLeft ? -arrowSize : arrowSize) / 3,
          },
          ...css,
        }}
      />
    )
  }
}
