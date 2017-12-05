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
    return (
      <title $$background={BANNER_COLORS[store.banner && store.banner.type]}>
        <titleText>
          <UI.Text ellipse size={0.9}>
            {(store.banner && store.banner.message) ||
              oraStore.stack.last.result.id ||
              'Search'}
          </UI.Text>
        </titleText>
      </title>
    )
  }

  static style = {
    title: {
      opacity: 0.28,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
      pointerEvents: 'none',
      userSelect: 'none',
    },
    titleText: {
      position: 'absolute',
      right: 81,
      left: 34,
    },
  }
}
