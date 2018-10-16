import * as React from 'react'
import { view, compose, react, ensure } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { ThemeObject } from '@mcro/gloss'
import { App } from '@mcro/stores'

type Props = {
  store?: PeekArrowStore
  peekStore: PeekStore
  borderShadow: any
  theme: ThemeObject
}

const getBackground = (y, theme) => {
  if (y < 20) return theme.titleBar.background
  if (y < 40) return theme.titleBar.backgroundBottom
  return theme.background
}

const maxTopOffset = 32
const arrowSize = 14
const peekOnRight = false

class PeekArrowStore {
  props: Props

  hide = react(() => this.props.peekStore.isTorn, _ => _)

  arrowY = react(
    () => App.peekState,
    state => {
      ensure('state and target', !!(state && state.position && state.target))
      const isHidden = !state
      const target = state.target
      // aim for the middle, but cap it at most maxTopOffset from top
      const arrowTopOffset = Math.min(maxTopOffset, target.height / 2)
      return Math.min(
        isHidden ? 0 : target.top + arrowTopOffset - state.position[1] - arrowSize / 2,
        state.size[1] - Constants.PEEK_BORDER_RADIUS * 2 - arrowSize,
      )
    },
  )
}

const decorator = compose(
  attachTheme,
  view.attach({ store: PeekArrowStore }),
  view,
)

export const PeekFrameArrow = decorator(({ store, theme, borderShadow }: Props) => {
  if (store.hide) {
    return null
  }
  log(`RENDER ${store.arrowY}`)
  return (
    <UI.Arrow
      position="absolute"
      top={0}
      zIndex={100}
      transition="transform ease 80ms"
      size={arrowSize}
      towards={peekOnRight ? 'left' : 'right'}
      background={getBackground(store.arrowY, theme)}
      boxShadow={[[0, 0, 10, [0, 0, 0, 0.05]], borderShadow]}
      transform={{
        y: store.arrowY,
        x: peekOnRight ? 0.5 : -0.5,
      }}
      {...{
        left: !peekOnRight ? 'auto' : -14,
        right: !peekOnRight ? -arrowSize : 'auto',
        zIndex: 1000000000,
      }}
    />
  )
})
