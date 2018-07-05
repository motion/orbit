import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from '../orbitCard'
import * as UI from '@mcro/ui'
import { Setting } from '@mcro/models'
import { modelQueryReaction } from '@mcro/helpers'
import * as Views from '~/views'

class OrbitGeneralSettingsStore {
  generalSetting = modelQueryReaction(
    () =>
      Setting.findOne({
        where: { type: 'setting', category: 'general' },
      }),
    {
      condition: () => this.props.settingsStore.isPaneActive,
    },
  )

  handleChange = prop => val => {
    console.log('handleChange', prop, val)
    this.generalSetting.values[prop] = val
    this.generalSetting.save()
  }
}

@view({
  store: OrbitGeneralSettingsStore,
})
export class OrbitGeneralSettings extends React.Component {
  render({ store, settingsStore }) {
    const { integrationSettings } = settingsStore
    const { generalSetting } = store
    if (!generalSetting) {
      return null
    }
    console.log('generalSetting', generalSetting)
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
            checked={generalSetting.values.autoLaunch}
            onChange={store.handleChange('autoLaunch')}
          >
            Start on Login
          </Views.CheckBoxRow>
          <Views.InputRow
            label="Open shortcut"
            value={generalSetting.values.openShortcut}
            onChange={store.handleChange('openShortcut')}
          />
        </OrbitCard>
      </>
    )
  }
}
