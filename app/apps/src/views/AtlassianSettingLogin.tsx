import { command } from '@mcro/bridge'
import { useActiveSpace } from '@mcro/kit'
import {
  AtlassianSource,
  AtlassianSourceValuesCredentials,
  Source,
  SourceSaveCommand,
} from '@mcro/models'
import { Button, Col, InputRow, Message, Table, Theme, VerticalSpace } from '@mcro/ui'
import * as React from 'react'

type Props = {
  type: string
  source?: Source
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

export function AtlassianSettingLogin(props: Props) {
  const [activeSpace] = useActiveSpace()
  const [status, setStatus] = React.useState('')
  const [error, setError] = React.useState('')
  const [source] = React.useState(
    (props.source as AtlassianSource) ||
      ({
        category: 'source',
        type: props.type,
        token: null,
      } as AtlassianSource),
  )
  const [credentials, setCredentials] = React.useState(
    source.values.credentials || {
      username: '',
      password: '',
      domain: '',
    },
  )

  const addSource = async e => {
    e.preventDefault()
    source.values = { ...source.values, credentials }
    if (!source.spaces) {
      source.spaces = []
    }
    if (!source.spaces.find(space => space.id === activeSpace.id)) {
      source.spaces.push(activeSpace)
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
      // !TODO
      // AppActions.clearPeek()
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
    <Col tagName="form" onSubmit={addSource}>
      <Message>
        Atlassian requires username and password as their OAuth requires administrator permissions.
        As always with Orbit, this information is <strong>completely private</strong> to you.
      </Message>
      <VerticalSpace />
      <Col margin="auto" width={370}>
        <Col>
          <Table>
            <InputRow
              label="Domain"
              value={credentials.domain}
              // !TODO
              onChange={handleChange('domain') as any}
            />
            <InputRow
              label="Username"
              value={credentials.username}
              // !TODO
              onChange={handleChange('username') as any}
            />
            <InputRow
              label="Password"
              type="password"
              value={credentials.password}
              // !TODO
              onChange={handleChange('password') as any}
            />
          </Table>
          <VerticalSpace />
          <Theme
            theme={{
              color: '#fff',
              background: buttonThemes[status] || '#4C36C4',
            }}
          >
            {status === Statuses.LOADING && <Button>Saving...</Button>}
            {status !== Statuses.LOADING && (
              <Button type="submit" onClick={addSource}>
                Save
              </Button>
            )}
          </Theme>
          <VerticalSpace />
          {error && <Message>{error}</Message>}
        </Col>
      </Col>
    </Col>
  )
}
