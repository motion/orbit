import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { OrbitIcon } from '~/apps/orbit/orbitIcon'

@view({
  store: class {
    max = ''

    willMount() {
      this.props.setting.values = {
        syncSettings: { max: 50 },
        ...this.props.setting.values,
      }
      const settings = this.props.setting.values.syncSettings
      this.max = settings.max
    }
  },
})
export class GoogleMail extends React.Component {
  render({ store, setting, update }) {
    const { syncSettings } = setting.values
    return (
      <gmailSetting>
        <OrbitIcon icon="gmail" />
        <UI.Field
          row
          label="Max"
          value={store.max}
          onChange={async e => {
            store.max = e.target.value
            setting.values.syncSettings = {
              ...syncSettings,
              max: store.max,
            }
            await setting.save()
            update()
          }}
        />
      </gmailSetting>
    )
  }
}
