import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { SubTitle } from '../../../../views'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'
import { SettingPaneProps } from './SettingPaneProps'

class JiraSettingStore {
  active = 'general'
}

const Section = view({ flex: 1 })

@view.attach({
  store: JiraSettingStore,
})
@view
export class JiraSetting extends React.Component<
  SettingPaneProps & {
    store: JiraSettingStore
  }
> {
  render() {
    const { store, children } = this.props
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
            <UI.View margin="auto">
              <SubTitle css={{ textAlign: 'center' }}>All good!</SubTitle>
              <OrbitIcon icon="confluence" size={256} />
            </UI.View>
          </Section>
          <Section if={store.active === 'account'}>
            <AtlassianSettingLogin setting={this.props.setting} />
          </Section>
        </UI.View>
      ),
    })
  }
}
