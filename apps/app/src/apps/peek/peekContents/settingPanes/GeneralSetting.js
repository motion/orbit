import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitCard } from '../../../../apps/orbit/OrbitCard'
// import * as UI from '@mcro/ui'
import * as Views from '../../../../views'

class OrbitGeneralSettingsStore {
  handleChange = prop => val => {
    console.log('handleChange', prop, val)
    this.props.setting.values[prop] = val
    this.props.setting.save()
  }
}

@view.attach({
  store: OrbitGeneralSettingsStore,
})
@view
export class GeneralSetting extends React.Component {
  render({ store, setting, children }) {
    if (!setting) {
      return null
    }
    return children({
      content: (
        <>
          <Views.SubTitle>Settings</Views.SubTitle>
          <OrbitCard>
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
      ),
    })
  }
}
