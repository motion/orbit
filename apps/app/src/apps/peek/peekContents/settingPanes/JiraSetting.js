import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../../orbit/orbitIcon'
import { SubTitle } from '../../../../views'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'

class JiraSettingStore {
  active = 'general'
}

@view.attach({
  store: JiraSettingStore,
})
@view
export class JiraSetting extends React.Component {
  render({ store, children }) {
    return children({
      subhead: (
        <UI.Tabs
          $tabs
          active={store.active}
          onActive={key => (store.active = key)}
        >
          <UI.Tab key="general" width="50%" label="General" />
          <UI.Tab key="account" width="50%" label="Account" />
        </UI.Tabs>
      ),
      content: (
        <container>
          <section if={store.active === 'general'}>
            <inner $centered>
              <SubTitle css={{ textAlign: 'center' }}>All good!</SubTitle>
              <OrbitIcon icon="confluence" size={256} />
            </inner>
          </section>
          <section if={store.active === 'account'}>
            <AtlassianSettingLogin setting={this.props.setting} />
          </section>
        </container>
      ),
    })
  }

  static style = {
    container: {
      flex: 1,
    },
    section: {
      flex: 1,
    },
    centered: {
      margin: 'auto',
    },
  }
}
