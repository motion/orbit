import { react, view, attach } from '@mcro/black'
import { command } from '@mcro/model-bridge'
import {
  SourceSaveCommand,
  AtlassianSourceValuesCredentials,
  AtlassianSource,
  Source,
} from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { Actions } from '../../../actions/Actions'
import * as Views from '../../../views'
import { Message } from '../../../views/Message'

type Props = {
  type: string
  source?: AtlassianSource
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
  // source: Setting

  status: string
  error: string
  values: AtlassianSource['values'] = {
    username: '',
    password: '',
    domain: '',
  }

  source = react(
    () => this.props.source,
    async propSetting => {
      // if source was sent via component props then use it
      if (propSetting) {
        this.values = propSetting.values.credentials
        return propSetting
      }

      // if setting prop was not defined then at least
      // integration type should be defined to create a new setting
      if (!this.props.type) throw new Error('No props.type')

      // create a new empty setting
      return {
        category: 'integration',
        type: this.props.type,
        token: null,
      } as Source
    },
  )
}

@attach({
  store: AtlassianSettingLoginStore,
})
@view
export class AtlassianSettingLogin extends React.Component<
  Props & { store?: AtlassianSettingLoginStore }
> {
  // if (!values.username || !values.password || !values.domain)
  // if (values.domain.indexOf('http') !== 0)

  addIntegration = async e => {
    e.preventDefault()
    const { source } = this.props.store
    source.values = { ...source.values, credentials: this.props.store.values }
    console.log(`adding integration!`, source)

    // send command to the desktop
    this.props.store.status = Statuses.LOADING
    const result = await command(SourceSaveCommand, {
      source,
    })

    // update status on success of fail
    if (result.success) {
      this.props.store.status = Statuses.SUCCESS
      this.props.store.error = null
      Actions.clearPeek()
    } else {
      this.props.store.status = Statuses.FAIL
      this.props.store.error = result.error
    }
  }

  handleChange = (prop: keyof AtlassianSourceValuesCredentials) => (
    val: AtlassianSourceValuesCredentials[typeof prop],
  ) => {
    this.props.store.values = {
      ...this.props.store.values,
      [prop]: val,
    }
  }

  render() {
    const { values, status, error } = this.props.store
    return (
      <UI.Col tagName="form" onSubmit={this.addIntegration} padding={20}>
        <Message>
          Atlassian requires username and password as their OAuth requires administrator
          permissions. As always with Orbit, this information is <strong>completely private</strong>{' '}
          to you.
        </Message>
        <Views.VerticalSpace />
        <UI.Col margin="auto" width={370}>
          <UI.Col padding={[0, 10]}>
            <Views.Table>
              <Views.InputRow
                label="Domain"
                value={values.domain}
                onChange={this.handleChange('domain')}
              />
              <Views.InputRow
                label="Username"
                value={values.username}
                onChange={this.handleChange('username')}
              />
              <Views.InputRow
                label="Password"
                type="password"
                value={values.password}
                onChange={this.handleChange('password')}
              />
            </Views.Table>
            <Views.VerticalSpace />
            <UI.Theme
              theme={{
                color: '#fff',
                background: buttonThemes[status] || '#4C36C4',
              }}
            >
              {status === Statuses.LOADING && <UI.Button>Saving...</UI.Button>}
              {status !== Statuses.LOADING && (
                <UI.Button type="submit" onClick={this.addIntegration}>
                  Save
                </UI.Button>
              )}
            </UI.Theme>
            <Views.VerticalSpace />
            {error && <Message>{error}</Message>}
          </UI.Col>
        </UI.Col>
      </UI.Col>
    )
  }
}
