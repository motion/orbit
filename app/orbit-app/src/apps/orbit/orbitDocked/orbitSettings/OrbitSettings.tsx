import { view } from '@mcro/black'
import * as React from 'react'
import { SubPane } from '../../SubPane'
import { OrbitSettingsApps } from './OrbitSettingsApps'
import { OrbitSettingsGeneral } from './OrbitSettingsGeneral'
import { OrbitSettingsTeam } from './OrbitSettingsTeam'
import { SegmentedRow, Button, Row } from '@mcro/ui'
import { Centered } from '../../../../views/Centered'
import { memoize } from 'lodash'
import { VerticalSpace } from '../../../../views'

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

@view.attach({
  store: OrbitSettingsStore,
})
@view
export class OrbitSettings extends React.Component<{ name: string; store?: OrbitSettingsStore }> {
  buttonProps = (store: OrbitSettingsStore, val: string) => {
    return {
      onClick: store.activeSetter(val),
      active: val === store.active,
    }
  }

  render() {
    const { name, store } = this.props
    return (
      <SubPane name={name} fadeBottom>
        <Row flex={1} height={35} position="relative">
          <Centered>
            <SegmentedRow>
              <Button {...this.buttonProps(store, 'apps')}>Apps</Button>
              <Button {...this.buttonProps(store, 'team')}>Team</Button>
              <Button {...this.buttonProps(store, 'general')}>General</Button>
            </SegmentedRow>
          </Centered>
        </Row>

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
