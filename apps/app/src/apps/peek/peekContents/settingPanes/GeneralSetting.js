import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from '~/apps/orbit/orbitCard'
import * as UI from '@mcro/ui'
import * as Views from '~/views'

class OrbitGeneralSettingsStore {
  handleChange = prop => val => {
    console.log('handleChange', prop, val)
    this.props.setting.values[prop] = val
    this.props.setting.save()
  }
}

@view({
  store: OrbitGeneralSettingsStore,
})
export class GeneralSetting extends React.Component {
  render({ store, setting, settingsStore }) {
    const { integrationSettings } = settingsStore
    if (!setting) {
      return null
    }
    return (
      <>
        <Views.SubTitle>Settings</Views.SubTitle>
        <OrbitCard>
          <UI.Text css={{ marginBottom: 10 }}>
            You've added {integrationSettings.length} integration{integrationSettings.length ===
            '1'
              ? ''
              : 's'}.{' '}
            {integrationSettings.length === 0
              ? 'Add some integrations below to get started with Orbit.'
              : ''}
          </UI.Text>
          <Views.CheckBoxRow
            checked={setting.values.autoLaunch}
            onChange={store.handleChange('autoLaunch')}
          >
            Start on Login
          </Views.CheckBoxRow>
          <Views.InputRow
            label="Open shortcut"
            value={setting.values.openShortcut}
            onChange={store.handleChange('openShortcut')}
          />
        </OrbitCard>
      </>
    )
  }
}
