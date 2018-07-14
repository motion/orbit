import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../../orbit/OrbitIcon'
import { SubTitle } from '../../../../views'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'

class JiraSettingStore {
  active = 'general'
}

const Section = view({ flex: 1 })

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
        <UI.View flex={1}>
          <Section if={store.active === 'general'}>
            <div $centered>
              <SubTitle css={{ textAlign: 'center' }}>All good!</SubTitle>
              <OrbitIcon icon="confluence" size={256} />
            </div>
          </Section>
          <Section if={store.active === 'account'}>
            <AtlassianSettingLogin setting={this.props.setting} />
          </Section>
        </UI.View>
      ),
    })
  }

  static style = {
    centered: {
      margin: 'auto',
    },
  }
}
