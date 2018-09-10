import * as React from 'react'
import { view, compose } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { App } from '@mcro/stores'
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

export const PeekFrameArrow = decorator(
  ({ peekStore, theme, borderShadow }: Props) => {
    if (!peekStore.isPeek) {
      return null
    }
    const state = App.peekState
    if (!state || !state.position || !state.position.length || !state.target) {
      return null
    }
    const isHidden = !state
    const onRight = !state.peekOnLeft
    const arrowSize = 14
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
  },
)
