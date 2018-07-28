import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { App } from '@mcro/stores'

type Props = {
  peekStore: PeekStore
  borderShadow: any
}

const background = '#f9f9f9'

export const PeekFrameArrow = view(({ peekStore, borderShadow }: Props) => {
  const state = App.peekState
  if (!state || !state.position || !state.position.length || !state.target) {
    return null
  }
  const { theme } = peekStore
  const isHidden = !state
  const onRight = !state.peekOnLeft
  const arrowSize = 20
  const ARROW_CARD_TOP_OFFSET = 32
  const arrowY = Math.min(
    isHidden
      ? 0
      : state.target.top +
        ARROW_CARD_TOP_OFFSET -
        state.position[1] -
        arrowSize / 2,
    state.size[1] - Constants.PEEK_BORDER_RADIUS * 2 - arrowSize,
  )
  return (
    <UI.Arrow
      position="absolute"
      top={0}
      zIndex={100}
      transition="transform ease 70ms"
      size={arrowSize}
      towards={onRight ? 'left' : 'right'}
      background={
        arrowY < 40 && theme
          ? UI.color(theme.background).darken(theme.darkenTitleBarAmount || 0)
          : background
      }
      boxShadow={[[0, 0, 10, [0, 0, 0, 0.05]], borderShadow]}
      css={{
        left: !onRight ? 'auto' : -14,
        right: !onRight ? -arrowSize : 'auto',
        zIndex: 1000000000,
        transform: {
          y: arrowY,
          x: onRight ? 0.5 : -0.5,
        },
      }}
    />
  )
})
