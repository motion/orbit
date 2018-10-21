import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PaneManagerStore } from '../../PaneManagerStore'
import { ThemeObject } from '@mcro/gloss'
import { memoize } from 'lodash'

const Section = view('section', {
  width: '100%',
  flexFlow: 'row',
  padding: [0, 6],
  alignItems: 'center',
  transition: 'all ease 500ms',
  transform: {
    y: -0.5,
  },
  invisible: {
    opacity: 0,
    pointerEvents: 'none',
  },
})

type Props = {
  paneManagerStore: PaneManagerStore
  theme?: ThemeObject
}

const exploreButton = {
  size: 1.3,
  width: 32,
  circular: true,
  glint: false,
  borderWidth: 0,
  borderColor: 'transparent',
  background: 'transparent',
  opacity: 0.5,
  iconProps: {
    size: 11,
  },
  hoverStyle: {
    opacity: 0.6,
    background: 'transparent',
  },
  activeStyle: {
    opacity: 1,
    fontWeight: 701,
    background: 'transparent',
  },
}

@view
export class OrbitHomeHeader extends React.Component<Props> {
  paneSetter = memoize(name => () => {
    this.props.paneManagerStore.setActivePane(name)
  })

  render() {
    const { paneManagerStore } = this.props
    const homeActive =
      paneManagerStore.activePane === 'home' || paneManagerStore.activePane === 'search'
    return (
      <>
        <Section invisible={paneManagerStore.activePane === 'onboard'}>
          {!homeActive && (
            <UI.Button
              icon="home"
              tooltip="Home"
              active={homeActive}
              onClick={this.paneSetter('home')}
              {...exploreButton}
            />
          )}
          <UI.Button
            icon="menudot"
            tooltip="Settings"
            active={paneManagerStore.activePaneFast === 'settings'}
            onClick={this.paneSetter('settings')}
            {...exploreButton}
          />
        </Section>
      </>
    )
  }
}
