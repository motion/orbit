import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { throttle } from 'lodash'
import OrbitIcon from '~/apps/orbit/orbitIcon'

@view
export default class GoogleMailSetting {
  render({ setting }) {
    const { syncSettings = { max: 50 } } = setting.values
    const throttleSaveSetting = throttle(() => setting.save(), 500)
    return (
      <gmailSetting>
        <OrbitIcon icon="gmail" />
        <UI.Field
          row
          label="Max"
          value={syncSettings.max}
          onChange={e => {
            setting.values.syncSettings = {
              ...syncSettings,
              max: e.target.value,
            }
            store.settingVersion += 1
            throttleSaveSetting()
          }}
        />
      </gmailSetting>
    )
  }
}
