import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Views from '~/views'
import { Setting } from '@mcro/models'
import { debounce } from 'lodash'

class ConfluenceSettingLoginStore {
  setting = null

  willMount() {
    this.setting = new Setting()
    this.setting.category = 'integration'
    this.setting.type = 'confluence'
    this.setting.values = {
      atlassian: {
        username: '',
        password: '',
      },
    }
  }

  handleChange = prop => val => {
    this.setting.values.atlassian[prop] = val
    this.saveSetting()
  }

  saveSetting = debounce(() => {
    this.setting.save()
  }, 100)
}

@view({
  store: ConfluenceSettingLoginStore,
})
export class ConfluenceSettingLogin extends React.Component {
  render({ store }) {
    return (
      <auth>
        <Views.InputRow
          label="Username"
          value={store.setting.values.username}
          onChange={store.handleChange('username')}
        />
        <Views.InputRow
          label="Password"
          type="password"
          value={store.setting.values.password}
          onChange={store.handleChange('password')}
        />
        <UI.Row>
          <div $$flex />
          <UI.Theme theme="#4C36C4">
            <UI.Button>Submit</UI.Button>
          </UI.Theme>
        </UI.Row>
      </auth>
    )
  }

  static style = {
    auth: {
      margin: 'auto',
    },
  }
}
