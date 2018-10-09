import { view } from '@mcro/black'
import * as React from 'react'
import { SubPane } from '../../SubPane'
import { OrbitSettingsApps } from './OrbitSettingsApps'
import { OrbitSettingsGeneral } from './OrbitSettingsGeneral'
import { OrbitSettingsTeam } from './OrbitSettingsTeam'
import { SegmentedRow, Button, Row } from '@mcro/ui'
import { memoize } from 'lodash'
import { VerticalSpace } from '../../../../views'
import { PaneManagerStore } from '../../PaneManagerStore'

const Pane = view({
  height: 0,
  opacity: 0,
  pointerEvents: 'none',
  isShown: {
    height: 'auto',
    opacity: 1,
    pointerEvents: 'inherit',
  },
})

class OrbitSettingsStore {
  active = 'apps'

  activeSetter = memoize(val => () => (this.active = val))
}

@view.attach('paneManagerStore')
@view.attach({
  store: OrbitSettingsStore,
})
@view
export class OrbitSettings extends React.Component<{
  name: string
  store?: OrbitSettingsStore
  paneManagerStore?: PaneManagerStore
}> {
  buttonProps = (store: OrbitSettingsStore, val: string) => {
    return {
      onClick: store.activeSetter(val),
      active: val === store.active,
    }
  }

  render() {
    const { name, store, paneManagerStore } = this.props
    const isActive = paneManagerStore.activePane === 'settings'
    return (
      <SubPane
        name={name}
        overflow="visible"
        before={
          <Row
            flex={1}
            height={35}
            position="absolute"
            top={-47}
            left={100}
            right={100}
            pointerEvents="none"
            alignItems="center"
            justifyContent="center"
          >
            <SegmentedRow pointerEvents={isActive ? 'auto' : 'none'}>
              <Button {...this.buttonProps(store, 'apps')}>Apps</Button>
              <Button {...this.buttonProps(store, 'team')}>Team</Button>
              <Button {...this.buttonProps(store, 'general')}>General</Button>
            </SegmentedRow>
          </Row>
        }
      >
        <VerticalSpace />

        <Pane isShown={store.active === 'apps'}>
          <OrbitSettingsApps />
        </Pane>
        <Pane isShown={store.active === 'team'}>
          <OrbitSettingsTeam />
        </Pane>
        <Pane isShown={store.active === 'general'}>
          <OrbitSettingsGeneral />
        </Pane>
      </SubPane>
    )
  }
}
