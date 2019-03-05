import { App } from '@mcro/stores'
import * as UI from '@mcro/ui'
import { ensure, react, useHook, useStore } from '@mcro/use-store'
import * as React from 'react'
import * as Constants from '../../constants'
import { useStoresSimple } from '../../hooks/useStores'

type Props = {
  borderShadow: any
}

const maxTopOffset = 32
const arrowSize = 14
const peekOnRight = false

class AppArrowStore {
  props: Props
  stores = useHook(useStoresSimple)

  hide = react(() => this.stores.appPageStore.isTorn, _ => _)

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

export default function AppFrameArrow({ borderShadow }: Props) {
  const { activeTheme } = React.useContext(UI.ThemeContext)
  const store = useStore(AppArrowStore)
  if (store.hide) {
    return null
  }
  return (
    <UI.Arrow
      position="absolute"
      top={0}
      zIndex={100}
      transition="transform ease 80ms"
      size={arrowSize}
      towards={peekOnRight ? 'left' : 'right'}
      background={activeTheme.background}
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
}
