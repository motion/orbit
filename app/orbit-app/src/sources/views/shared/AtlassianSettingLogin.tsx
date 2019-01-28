import { command } from '@mcro/model-bridge'
import {
  AtlassianSource,
  AtlassianSourceValuesCredentials,
  Source,
  SourceSaveCommand,
} from '@mcro/models'
import * as UI from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../../actions/AppActions'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
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

export default observer(function AtlassianSettingLogin(props: Props) {
  const { spaceStore } = useStoresSafe()
  const [status, setStatus] = React.useState('')
  const [error, setError] = React.useState('')
  const [source] = React.useState(
    props.source ||
      ({
        category: 'integration',
        type: props.type,
        token: null,
      } as Source),
  )
  const [credentials, setCredentials] = React.useState<AtlassianSource['values']['credentials']>(
    (props.source && props.source.values.credentials) || {
      username: '',
      password: '',
      domain: '',
    },
  )

  const addIntegration = async e => {
    e.preventDefault()
    source.values = { ...source.values, credentials }
    if (!source.spaces) {
      source.spaces = []
    }
    if (!source.spaces.find(space => space.id === spaceStore.activeSpace.id)) {
      source.spaces.push(spaceStore.activeSpace)
    }
    // send command to the desktop
    setStatus(Statuses.LOADING)
    const result = await command(SourceSaveCommand, {
      source,
    })
    // update status on success of fail
    if (result.success) {
      setStatus(Statuses.SUCCESS)
      setError(null)
      AppActions.clearPeek()
    } else {
      setStatus(Statuses.FAIL)
      setError(result.error)
    }
  }

  const handleChange = (prop: keyof AtlassianSourceValuesCredentials) => (
    val: AtlassianSourceValuesCredentials[typeof prop],
  ) => {
    setCredentials({
      ...credentials,
      [prop]: val,
    })
  }

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
              value={credentials.domain}
              onChange={handleChange('domain')}
            />
            <Views.InputRow
              label="Username"
              value={credentials.username}
              onChange={handleChange('username')}
            />
            <Views.InputRow
              label="Password"
              type="password"
              value={credentials.password}
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
