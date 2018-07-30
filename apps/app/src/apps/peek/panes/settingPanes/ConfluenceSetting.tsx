import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { SubTitle } from '../../../../views'
import { AtlassianSettingLogin } from './AtlassianSettingLogin'

class ConfluenceSettingStore {
  active = 'general'
}

const Section = view({
  flex: 1,
})

@view.attach({
  store: ConfluenceSettingStore,
})
@view
export class ConfluenceSetting extends React.Component {
  render() {
    const { store, setting, children } = this.props
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
        <UI.Col flex={1}>
          <Section if={store.active === 'general'}>
            <UI.Col margin="auto">
              <SubTitle css={{ textAlign: 'center' }}>All good!</SubTitle>
              <OrbitIcon icon="confluence" size={256} />
            </UI.Col>
          </Section>
          <Section if={store.active === 'account'}>
            <AtlassianSettingLogin setting={setting} />
          </Section>
        </UI.Col>
      ),
    })
  }
}
