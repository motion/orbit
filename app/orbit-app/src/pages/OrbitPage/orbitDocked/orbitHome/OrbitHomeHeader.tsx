import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PaneManagerStore } from '../../PaneManagerStore'
import { ThemeObject } from '@mcro/gloss'
import { memoize } from 'lodash'
import { View, ClearButton, Icon } from '@mcro/ui'
import { SearchStore } from '../SearchStore'
import { QueryStore } from '../QueryStore'

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
  searchStore?: SearchStore
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
  opacity: 0.25,
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
  disabled: {
    opacity: 0,
    pointerEvents: 'none',
  },
})

@view.attach('queryStore', 'searchStore', 'paneManagerStore')
@view
export class OrbitHomeHeader extends React.Component<Props> {
  paneSetter = memoize(name => () => {
    this.props.paneManagerStore.setActivePane(name)
  })

  clearSearch = () => {
    this.props.queryStore.clearQuery()
    this.props.searchStore.searchFilterStore.resetAllFilters()
    this.props.paneManagerStore.setActivePane('home')
  }

  render() {
    const { paneManagerStore } = this.props
    const onSettings = paneManagerStore.activePane === 'settings'
    return (
      <>
        <Section invisible={paneManagerStore.activePane === 'onboard'}>
          <Interactive disabled={!/^(search|settings)$/.test(paneManagerStore.activePane)}>
            <ClearButton
              onClick={
                paneManagerStore.activePane === 'search'
                  ? this.clearSearch
                  : paneManagerStore.setActivePaneToPrevious
              }
            >
              <Icon name="arrow-min-left" size={8} opacity={0.8} margin="auto" />
            </ClearButton>
          </Interactive>
          <UI.Button
            icon={
              <View
                border={[1, '#999']}
                background={onSettings ? '#999' : 'transparent'}
                opacity={1}
                width={12}
                height={12}
                borderRadius={100}
              />
            }
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
