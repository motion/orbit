import * as React from 'react'
import { view } from '@mcro/black'
import OrbitDivider from './orbitDivider'
import * as Constants from '~/constants'

@view
export class SlideUpDrawer {
  static defaultProps = {
    slideAmount: 100,
  }

  render({ isActive, slideAmount, appStore, theme, children }) {
    const y = isActive ? -slideAmount : 0
    return (
      <slideDrawer
        css={{
          background: theme.base.background,
          transform: { y },
        }}
      >
        <OrbitDivider
          if={!appStore.searchState.query}
          css={{ paddingBottom: 0, zIndex: 1000, position: 'relative' }}
        />
        <space css={{ height: 20 }} />
        {children}
      </slideDrawer>
    )
  }
  static style = {
    slideDrawer: {
      borderBottomRadius: Constants.BORDER_RADIUS,
      position: 'relative',
      height: 'calc(100% - 35px)',
      transition: 'transform ease-in-out 150ms',
      zIndex: 100,
    },
  }
}
