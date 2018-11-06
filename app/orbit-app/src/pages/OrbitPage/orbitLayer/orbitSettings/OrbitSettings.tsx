import { view, attach } from '@mcro/black'
import * as React from 'react'
import { SubPane } from '../../../../components/SubPane'
import { OrbitSettingsApps } from './OrbitSettingsApps'
import { OrbitSettingsGeneral } from './OrbitSettingsGeneral'
import { OrbitSettingsTeam } from './OrbitSettingsTeam'
import { SegmentedRow, Button, Row } from '@mcro/ui'
import { VerticalSpace } from '../../../../views'
import { PaneManagerStore } from '../../../../stores/PaneManagerStore'

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

const SettingButton = props => (
  <Button width={90} sizeIcon={1.1} sizeRadius={2} elementProps={{ width: 'auto' }} {...props} />
)

@attach('paneManagerStore')
@view
export class OrbitSettings extends React.Component<{
  paneManagerStore?: PaneManagerStore
}> {
  buttonProps = (store: PaneManagerStore, val: string) => {
    return {
      onClick: store.subPaneSetter(val),
      active: val === store.subPane,
    }
  }

  render() {
    const { paneManagerStore } = this.props
    const isActive = paneManagerStore.activePane === 'settings'
    return (
      <SubPane
        id="settings"
        before={
          <Row
            flex={1}
            height={35}
            position="absolute"
            top={-47}
            left={150}
            right={150}
            alignItems="center"
            justifyContent="center"
          >
            <SegmentedRow pointerEvents={isActive ? 'auto' : 'none'}>
              <SettingButton {...this.buttonProps(paneManagerStore, 'apps')}>Sources</SettingButton>
              <SettingButton {...this.buttonProps(paneManagerStore, 'team')}>Spaces</SettingButton>
              <SettingButton {...this.buttonProps(paneManagerStore, 'general')}>
                Settings
              </SettingButton>
            </SegmentedRow>
          </Row>
        }
      >
        <VerticalSpace />

        <Pane isShown={paneManagerStore.subPane === 'apps'}>
          <OrbitSettingsApps />
        </Pane>
        <Pane isShown={paneManagerStore.subPane === 'team'}>
          <OrbitSettingsTeam />
        </Pane>
        <Pane isShown={paneManagerStore.subPane === 'general'}>
          <OrbitSettingsGeneral />
        </Pane>
      </SubPane>
    )
  }
}
