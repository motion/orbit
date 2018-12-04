import * as React from 'react'
import { view, attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import { ThemeObject } from '@mcro/gloss'
import { memoize } from 'lodash'
import { View, ClearButton, Icon } from '@mcro/ui'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { PaneManagerStore } from '../../stores/PaneManagerStore'

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
  queryStore?: QueryStore
  paneManagerStore?: PaneManagerStore
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
  opacity: 0.2,
  iconProps: {
    size: 12,
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

const Interactive = view({
  flexFlow: 'row',
  alignItems: 'center',
  opacity: 0,
  pointerEvents: 'none',
  enabled: {
    opacity: 1,
    pointerEvents: 'inherit',
  },
})

@attach('queryStore', 'paneManagerStore')
@view
export class OrbitHeaderButtons extends React.Component<Props> {
  paneSetter = memoize(name => () => {
    this.props.paneManagerStore.setActivePane(name)
  })

  clearSearch = () => {
    this.props.queryStore.clearQuery()
    this.props.paneManagerStore.setActivePane('home')
  }

  render() {
    const { paneManagerStore, queryStore } = this.props
    const onSettings = paneManagerStore.activePane === 'settings'
    return (
      <>
        <Section invisible={paneManagerStore.activePane === 'onboard'}>
          <Interactive enabled={paneManagerStore.activePane === 'settings' || queryStore.hasQuery}>
            <ClearButton
              onClick={
                paneManagerStore.activePane === 'settings'
                  ? paneManagerStore.setActivePaneToPrevious
                  : this.clearSearch
              }
            >
              <Icon name="arrow-min-left" size={8} opacity={0.8} margin="auto" />
            </ClearButton>
          </Interactive>
          <UI.Button
            icon="gear"
            tooltip="Settings"
            tooltipProps={{
              delay: 0,
            }}
            active={onSettings}
            onClick={this.paneSetter('settings')}
            {...exploreButton}
          />
        </Section>
      </>
    )
  }
}
