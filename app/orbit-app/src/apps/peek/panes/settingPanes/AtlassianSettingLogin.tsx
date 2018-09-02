import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { SettingRepository } from '../../../../repositories'
import * as Views from '../../../../views'
import { Message } from '../../../../views/Message'
import { Setting } from '@mcro/models'
import { AtlassianService } from '@mcro/services'
import { capitalize } from 'lodash'
import { Actions } from '../../../../actions/Actions'

type Props = {
  type: string
  setting?: Setting
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

      const values = {
        category: 'integration',
        type: this.props.type,
        token: null,
      } as Setting
      const setting = await SettingRepository.findOne({ where: values })
      if (setting) {
        return setting
      }
      return await SettingRepository.save(values)
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
    return await SettingRepository.findOne({
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
    // replaced following code: this.setting.save()
    // code here is very strange because it saves a something that I don't know type of,
    // but assume its a setting
    SettingRepository.save(this.setting)
    Actions.clearPeek()
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
                {!!store.existingSetting && (
                  <Views.Link onClick={store.importExisting}>
                    Import from {capitalize(store.existingSetting.type)}.
                  </Views.Link>
                )}
              </UI.View>
              <UI.Theme theme={buttonThemes[store.status] || '#4C36C4'}>
                {!store.status ||
                  (store.status === Statuses.FAIL && (
                    <UI.Button onClick={store.save}>Save</UI.Button>
                  ))}
                {store.status === Statuses.LOADING && (
                  <UI.Button>Saving...</UI.Button>
                )}
                {store.status === Statuses.SUCCESS && (
                  <UI.Button onClick={store.addIntegration}>
                    Add Integration
                  </UI.Button>
                )}
              </UI.Theme>
            </UI.ListRow>
            <Views.VertSpace />
            {store.error && <Message>{store.error}</Message>}
            {store.status === Statuses.SUCCESS && (
              <Message>
                Looks good! We can login to your account successfully.
              </Message>
            )}
          </UI.Col>
        </UI.Col>
      </UI.Col>
    )
  }
}
