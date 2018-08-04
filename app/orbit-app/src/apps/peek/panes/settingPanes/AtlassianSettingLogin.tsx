import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Views from '../../../../views'
import { Message } from '../../../../views/Message'
import { Setting, findOrCreate } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import { App } from '@mcro/stores'
import { capitalize } from 'lodash'

type Props = {
  type: string
  setting: Setting
}

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
  props: Props

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
    this.setting.token = 'good'
    this.setting.save()
    App.actions.clearPeek()
  }

  // autoSave = debounce(this.save, 400)
}

@view.attach({
  store: AtlassianSettingLoginStore,
})
@view
export class AtlassianSettingLogin extends React.Component<
  Props & { store?: AtlassianSettingLoginStore }
> {
  render() {
    const { store } = this.props
    return (
      <UI.Col padding={20}>
        <Message>
          Atlassian requires username and password as their OAuth requires
          administrator permissions. As always with Orbit, this information is{' '}
          <strong>completely private</strong> to you.
        </Message>
        <Views.VertSpace />
        <UI.Col margin="auto" width={370}>
          <UI.Col padding={[0, 10]}>
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
            <UI.ListRow>
              <UI.View flex={1}>
                <Views.Link
                  if={store.existingSetting}
                  onClick={store.importExisting}
                >
                  Import from {capitalize(store.existingSetting.type)}.
                </Views.Link>
              </UI.View>
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
            </UI.ListRow>
            <Views.VertSpace />
            <Message if={store.error}>{store.error}</Message>
            <Message if={store.status === Statuses.SUCCESS}>
              Looks good! We can login to your account successfully.
            </Message>
          </UI.Col>
        </UI.Col>
      </UI.Col>
    )
  }
}
