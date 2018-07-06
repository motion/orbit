import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitIcon } from '../../../orbit/orbitIcon'
import { SubTitle } from '../../../../views'
import { Tabs, Tab } from '@mcro/sonar'
import { ConfluenceSettingLogin } from './ConfluenceSettingLogin'

class ConfluenceSettingStore {
  active = 'general'
}

@view({
  store: ConfluenceSettingStore,
})
export class ConfluenceSetting extends React.Component {
  render({ store }) {
    return (
      <container>
        <Tabs
          $tabs
          active={store.active}
          onActive={key => (store.active = key)}
        >
          <Tab key="general" width="50%" label="General" />
          <Tab key="account" width="50%" label="Account" />
        </Tabs>
        <section if={store.active === 'general'}>
          <inner $centered>
            <SubTitle css={{ textAlign: 'center' }}>All good!</SubTitle>
            <OrbitIcon icon="confluence" size={256} />
          </inner>
        </section>
        <section if={store.active === 'account'}>
          <ConfluenceSettingLogin setting={this.props.setting} />
        </section>
      </container>
    )
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
