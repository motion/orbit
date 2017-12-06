import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import OraBannerStore from '~/stores/oraBannerStore'

export const TYPES = {
  note: 'note',
  success: 'success',
  error: 'error',
}

const BANNER_COLORS = {
  note: 'blue',
  success: 'green',
  error: 'red',
}

@view.attach('oraStore')
@view({
  store: OraBannerStore,
})
export default class OraBanner {
  render({ oraStore, store }) {
    const isPinning = !!store.banner
    return (
      <title $pinning={store.banner && store.banner.type}>
        <titleText>
          <UI.Text ellipse size={0.9} alpha={isPinning ? 0.7 : 0.3}>
            {(store.banner && store.banner.message) ||
              // oraStore.stack.last.result.id ||
              null}
          </UI.Text>
        </titleText>
      </title>
    )
  }

  static style = {
    title: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: -100,
      paddingBottom: 100,
      // textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
      pointerEvents: 'none',
      userSelect: 'none',
      transition: 'all 300ms ease-in',
    },
    pinning: type => ({
      background: UI.color(BANNER_COLORS[type]).alpha(0.5),
    }),
    titleText: {
      position: 'absolute',
      right: 81,
      left: 34,
    },
  }
}
