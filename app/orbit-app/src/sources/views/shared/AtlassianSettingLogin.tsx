import { react } from '@mcro/black'
import { command } from '@mcro/model-bridge'
import {
  SourceSaveCommand,
  AtlassianSourceValuesCredentials,
  AtlassianSource,
  Source,
} from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../../../actions/AppActions'
import * as Views from '../../../views'
import { Message } from '../../../views/Message'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import { useStoresSafe } from '../../../hooks/useStoresSafe'

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

export default observer(function AtlassianSettingLogin(props: Props) {
  const { spaceStore } = useStoresSafe()
  const store = useStore(AtlassianSettingLoginStore, { ...props, spaceStore })

  const addIntegration = async e => {
    e.preventDefault()
    const { source } = store
    source.values = { ...source.values, credentials: store.values }
    if (!source.spaces) source.spaces = []
    if (!source.spaces.find(space => space.id === spaceStore.activeSpace.id)) {
      source.spaces.push(spaceStore.activeSpace)
    }
    console.log(`adding integration!`, source)

    // send command to the desktop
    store.status = Statuses.LOADING
    const result = await command(SourceSaveCommand, {
      source,
    })

    // update status on success of fail
    if (result.success) {
      store.status = Statuses.SUCCESS
      store.error = null
      AppActions.clearPeek()
    } else {
      store.status = Statuses.FAIL
      store.error = result.error
    }
  }

  const handleChange = (prop: keyof AtlassianSourceValuesCredentials) => (
    val: AtlassianSourceValuesCredentials[typeof prop],
  ) => {
    store.values = {
      ...store.values,
      [prop]: val,
    }
  }

  const { values, status, error } = store
  return (
    <UI.Col tagName="form" onSubmit={addIntegration} padding={20}>
      <Message>
        Atlassian requires username and password as their OAuth requires administrator permissions.
        As always with Orbit, this information is <strong>completely private</strong> to you.
      </Message>
      <Views.VerticalSpace />
      <UI.Col margin="auto" width={370}>
        <UI.Col padding={[0, 10]}>
          <Views.Table>
            <Views.InputRow
              label="Domain"
              value={values.domain}
              onChange={handleChange('domain')}
            />
            <Views.InputRow
              label="Username"
              value={values.username}
              onChange={handleChange('username')}
            />
            <Views.InputRow
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange('password')}
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
              <UI.Button type="submit" onClick={addIntegration}>
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
})
