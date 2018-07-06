import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Views from '~/views'
import { Setting, findOrCreate, Not, Equal } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import { App } from '@mcro/stores'
import { capitalize } from 'lodash'

const Statuses = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
}

const buttonThemes = {
  [Statuses.LOADING]: '#999',
  [Statuses.SUCCESS]: 'darkgreen',
  [Statuses.FAIL]: 'darkred',
}

class AtlassianSettingLoginStore {
  retry = null
  error = null
  values = {
    username: '',
    password: '',
    domain: '',
  }

  setting = react(
    () => this.props.setting,
    async propSetting => {
      if (propSetting) {
        return propSetting
      }
      if (!this.props.type) {
        throw new Error('No props.type')
      }
      return await findOrCreate(Setting, {
        category: 'integration',
        type: this.props.type,
        token: null,
      })
    },
    {
      immediate: true,
    },
  )

  updateValuesFromSetting = react(
    () => this.setting,
    setting => {
      if (!setting) {
        throw react.cancel
      }
      setting.values = setting.values || {}
      if (!setting.values.atlassian) {
        setting.values.atlassian = {
          username: '',
          password: '',
          domain: '',
        }
      }
      this.values = setting.values.atlassian
    },
    {
      immediate: true,
    },
  )

  status = react(
    () => this.values,
    async (values, { setValue, sleep }) => {
      if (!values.username || !values.password || !values.domain) {
        throw react.cancel
      }
      if (values.domain.indexOf('http') !== 0) {
        throw react.cancel
      }
      // delay before running checks
      await sleep(700)
      setValue(Statuses.LOADING)
      this.setting.values.atlassian = values
      const service = new AtlassianService(this.setting)
      let res
      try {
        res = await service.fetch('/wiki/rest/api/content')
        if (!res) {
          // do something
          throw react.cancel
        }
        if (res.error) {
          this.error = `Failed to fetch from domain: ${values.domain}`
          setValue(Statuses.FAIL)
          return
        }
        if (res) {
          console.log('atlassian got res', res)
          setValue(Statuses.SUCCESS)
          return
        }
      } catch (err) {
        console.log('atlassian setting err', err)
        this.error = `${err.message || 'Some Error'}`
      }
      setValue(Statuses.FAIL)
    },
  )

  existingSetting = react(async () => {
    return await Setting.findOne({
      where: {
        type: this.props.type === 'confluence' ? 'jira' : 'confluence',
        token: 'good',
      },
    })
  })

  importExisting = () => {
    this.values = {
      ...this.existingSetting.values.atlassian,
    }
  }

  handleChange = prop => val => {
    this.values = {
      ...this.values,
      [prop]: val,
    }
  }

  save = async () => {
    this.retry = Date.now()
  }

  addIntegration = () => {
    this.setting.save()
    App.actions.clearPeek()
  }

  // autoSave = debounce(this.save, 400)
}

@view({
  store: AtlassianSettingLoginStore,
})
export class AtlassianSettingLogin extends React.Component {
  render({ store }) {
    return (
      <page css={{ padding: 20 }}>
        <Views.Message>
          Atlassian requires username and password as their OAuth requires
          administrator permissions. As always with Orbit, this information is{' '}
          <strong>completely private</strong> to you.
        </Views.Message>
        <Views.VertSpace />
        <auth>
          <inner css={{ padding: [0, 10] }}>
            <Views.Table>
              <Views.InputRow
                label="Username"
                value={store.values.username}
                onChange={store.handleChange('username')}
              />
              <Views.InputRow
                label="Password"
                type="password"
                value={store.values.password}
                onChange={store.handleChange('password')}
              />
              <Views.InputRow
                label="Domain"
                value={store.values.domain}
                onChange={store.handleChange('domain')}
              />
            </Views.Table>
            <Views.VertSpace />
            <UI.Row>
              <div $$flex>
                <Views.Link
                  if={store.existingSetting}
                  onClick={store.importExisting}
                >
                  Import from {capitalize(store.existingSetting.type)}.
                </Views.Link>
              </div>
              <UI.Theme theme={buttonThemes[store.status] || '#4C36C4'}>
                <UI.Button
                  if={!store.status || store.status === Statuses.FAIL}
                  onClick={store.save}
                >
                  Save
                </UI.Button>
                <UI.Button if={store.status === Statuses.LOADING}>
                  Saving...
                </UI.Button>
                <UI.Button
                  if={store.status === Statuses.SUCCESS}
                  onClick={store.addIntegration}
                >
                  Add Integration
                </UI.Button>
              </UI.Theme>
            </UI.Row>
            <Views.VertSpace />
            <Views.Message if={store.error}>{store.error}</Views.Message>
            <Views.Message if={store.status === Statuses.SUCCESS}>
              Looks good! We can login to your account successfully.
            </Views.Message>
          </inner>
        </auth>
      </page>
    )
  }

  static style = {
    auth: {
      margin: 'auto',
      width: 370,
    },
  }
}
