import * as React from 'react'
import { view, compose } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { ThemeObject } from '@mcro/gloss'

type Props = {
  peekStore: PeekStore
  borderShadow: any
  theme: ThemeObject
}

const getBackground = (y, theme) => {
  if (y < 20) return theme.titleBar.background
  if (y < 40) return theme.titleBar.backgroundBottom
  return theme.background
}

const decorator = compose(
  attachTheme,
  view,
)

export const PeekFrameArrow = decorator(({ peekStore, theme, borderShadow }: Props) => {
  if (!peekStore.isPeek) {
    return null
  }
  const { state } = peekStore
  if (!state || !state.position || !state.position.length || !state.target) {
    return null
  }
  const isHidden = !state
  const onRight = !state.peekOnLeft
  const arrowSize = 14
  const target = state.target
  // aim for the middle, but cap it at most MAX_TOP_OFF from top
  const MAX_TOP_OFF = 32
  const ARROW_CARD_TOP_OFFSET = Math.min(MAX_TOP_OFF, target.height / 2)
  const arrowY = Math.min(
    isHidden ? 0 : target.top + ARROW_CARD_TOP_OFFSET - state.position[1] - arrowSize / 2,
    state.size[1] - Constants.PEEK_BORDER_RADIUS * 2 - arrowSize,
  )
  return (
    <UI.Arrow
      position="absolute"
      top={0}
      zIndex={100}
      transition="transform ease 80ms"
      size={arrowSize}
      towards={onRight ? 'left' : 'right'}
      background={getBackground(arrowY, theme)}
      boxShadow={[[0, 0, 10, [0, 0, 0, 0.05]], borderShadow]}
      transform={{
        y: arrowY,
        x: onRight ? 0.5 : -0.5,
      }}
      {...{
        left: !onRight ? 'auto' : -14,
        right: !onRight ? -arrowSize : 'auto',
        zIndex: 1000000000,
      }}
    />
  )
})
