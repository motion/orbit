import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { OrbitIcon } from '../../../../apps/orbit/OrbitIcon'

class GmailSettingStore {
  max = ''

  willMount() {
    this.props.setting.values = {
      syncSettings: { max: 50 },
      ...this.props.setting.values,
    }
    const settings = this.props.setting.values.syncSettings
    this.max = settings.max
  }
}

@view.attach({
  store: GmailSettingStore,
})
@view
export class GmailSetting extends React.Component {
  render() {
    const { store, setting, update, children } = this.props
    const { syncSettings } = setting.values
    return children({
      content: (
        <section>
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
        </section>
      ),
    })
  }
}
