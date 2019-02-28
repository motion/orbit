import { command } from '@mcro/bridge'
import { useActiveSpace } from '@mcro/kit'
import { AppBit, AppSaveCommand } from '@mcro/models'
import { Button, Col, InputRow, Message, Table, Theme, VerticalSpace } from '@mcro/ui'
import * as React from 'react'

type Props = {
  identifier: string
  app?: AppBit
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

interface AtlassianAppValuesCredentials {
  domain: string
  username: string
  password: string
}

export function AtlassianSettingLogin(props: Props) {
  const [activeSpace] = useActiveSpace()
  const [status, setStatus] = React.useState('')
  const [error, setError] = React.useState('')
  const [app] = React.useState<Partial<AppBit>>({
    target: 'app',
    identifier: props.identifier as 'confluence',
    token: null,
    data: (props.app && props.app.data) || {},
  })
  const [credentials, setCredentials] = React.useState(
    (app.data.values && app.data.values.credentials) || {
      username: '',
      password: '',
      domain: '',
    },
  )

  const addApp = async e => {
    e.preventDefault()
    app.data.values = { ...app.data.values, credentials }
    if (!app.spaces) {
      app.spaces = []
    }
    if (!app.spaces.find(space => space.id === activeSpace.id)) {
      app.spaces.push(activeSpace)
    }
    // send command to the desktop
    setStatus(Statuses.LOADING)
    const result = await command(AppSaveCommand, {
      app,
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

  const handleChange = (prop: keyof AtlassianAppValuesCredentials) => (
    val: AtlassianAppValuesCredentials[typeof prop],
  ) => {
    setCredentials({
      ...credentials,
      [prop]: val,
    })
  }

  return (
    <Col tagName="form" onSubmit={addApp}>
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
              <Button type="submit" onClick={addApp}>
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
