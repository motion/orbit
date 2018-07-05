import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Views from '~/views'
import { Setting, findOrCreate } from '@mcro/models'
import { debounce } from 'lodash'

class ConfluenceSettingLoginStore {
  setting = null

  willMount() {
    this.setting = findOrCreate(Setting, {
      category: 'integration',
      type: 'confluence',
    })
    this.setting.values = this.setting.values || {
      atlassian: {
        username: '',
        password: '',
        domain: '',
      },
    }
  }

  handleChange = prop => val => {
    this.setting.values.atlassian[prop] = val
    // this.saveSetting()
  }

  save = () => {
    this.setting.save()
  }

  // saveSetting = debounce(() => {
  //   this.setting.save()
  // }, 100)
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
        <Views.InputRow
          label="Domain"
          value={store.setting.values.domain}
          onChange={store.handleChange('domain')}
        />
        <UI.Row>
          <div $$flex />
          <UI.Theme theme="#4C36C4">
            <UI.Button>Save</UI.Button>
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
