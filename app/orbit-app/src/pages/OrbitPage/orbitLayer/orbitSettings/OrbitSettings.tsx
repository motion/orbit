import { view, attach } from '@mcro/black'
import * as React from 'react'
import { SubPane } from '../../../../components/SubPane'
import { OrbitSettingsGeneral } from './OrbitSettingsGeneral'
import { OrbitSettingsTeam } from './OrbitSettingsTeam'
import { SegmentedRow, Button, Row } from '@mcro/ui'
import { VerticalSpace } from '../../../../views'
import { memoize } from 'lodash'
import { SubPaneStore } from '../../../../components/SubPaneStore'
import { AppView } from '../../../../apps/AppView'
import { Pane } from '../../../../views/Pane'

const SettingButton = props => (
  <Button width={90} sizeIcon={1.1} sizeRadius={2} elementProps={{ width: 'auto' }} {...props} />
)

export class SettingsStore {
  subPane = 'apps'

  subPaneSetter = memoize(val => () => this.setSubPane(val))

  setSubPane = val => {
    this.subPane = val
  }
}

type Props = {
  settingsStore?: SettingsStore
  subPaneStore?: SubPaneStore
  onChangeHeight: any
}

const buttonProps = (store: SettingsStore, val: string) => {
  return {
    onClick: store.subPaneSetter(val),
    active: val === store.subPane,
  }
}

@attach({
  settingsStore: SettingsStore,
})
@view
export class OrbitSettings extends React.Component<Props> {
  render() {
    const { settingsStore, onChangeHeight } = this.props
    return (
      <SubPane
        id="settings"
        preventScroll
        before={isActive => <SettingsNavBar isActive={isActive} settingsStore={settingsStore} />}
        onChangeHeight={onChangeHeight}
      >
        <VerticalSpace />

        <Pane isShown={settingsStore.subPane === 'apps'}>
          <AppView
            viewType="index"
            id="source"
            title="Sources"
            type="source"
            isActive={settingsStore.subPane === 'apps'}
          />
        </Pane>
        <Pane isShown={settingsStore.subPane === 'team'}>
          <OrbitSettingsTeam settingsStore={settingsStore} />
        </Pane>
        <Pane isShown={settingsStore.subPane === 'general'}>
          <OrbitSettingsGeneral />
        </Pane>
      </SubPane>
    )
  }
}

const SettingsNavBar = view(({ settingsStore, isActive }) => {
  return (
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
        <SettingButton {...buttonProps(settingsStore, 'apps')}>Sources</SettingButton>
        {/* <SettingButton {...buttonProps(settingsStore, 'team')}>Spaces</SettingButton> */}
        <SettingButton {...buttonProps(settingsStore, 'general')}>Settings</SettingButton>
      </SegmentedRow>
    </Row>
  )
})
