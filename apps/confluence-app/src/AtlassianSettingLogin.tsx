import { loadOne } from '@o/bridge/_'
import { AppBit, AppModel, save, useActiveSpace } from '@o/kit'
import { Button, Col, Form, FormField, InputField, Message, Space } from '@o/ui'
import * as React from 'react'
import { SyntheticEvent, useEffect } from 'react'
import { ConfluenceLoader } from './ConfluenceLoader'
import { ConfluenceAppData } from './ConfluenceModels'
import confluenceApp from './index'

type Props = {
  identifier: string
  app?: AppBit
}

const Statuses = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
}

interface AtlassianAppValuesCredentials {
  domain: string
  username: string
  password: string
}

const extractTeamNameFromDomain = (domain: string) => {
  return domain
    .replace('http://', '')
    .replace('https://', '')
    .replace('.atlassian.net/', '')
    .replace('.atlassian.net', '')
}

export function AtlassianSettingLogin(props: Props) {
  const [activeSpace] = useActiveSpace()
  const [status, setStatus] = React.useState('')
  const [error, setError] = React.useState('')
  const [app] = React.useState<Partial<AppBit>>({
    target: 'app',
    identifier: props.identifier as 'confluence',
    token: '',
    data: (props.app && props.app.data) || {},
  })
  const [credentials, setCredentials] = React.useState(
    (app.data.values && app.data.values.credentials) || {
      username: '',
      password: '',
      domain: '',
    },
  )

  // todo: remove it
  // load something from confluence (testing api)
  useEffect(() => {
    loadOne(AppModel, { args: { where: { identifier: 'confluence', tabDisplay: 'plain' } } }).then(
      app => {
        if (app) {
          confluenceApp
            .api(app)
            .loadUsers()
            .then(users => console.log('users', users))
        }
      },
    )
  }, [])

  const addApp = async e => {
    e.preventDefault()
    app.data.values = { ...app.data.values, credentials }
    if (!app.spaces) {
      app.spaces = []
    }
    if (!app.spaces.find(space => space.id === activeSpace.id)) {
      app.spaces.push(activeSpace)
    }
    app.spaceId = activeSpace.id
    // send command to the desktop
    setStatus(Statuses.LOADING)

    // save app
    try {
      const loader = new ConfluenceLoader(app as AppBit)
      await loader.test()
      app.name = extractTeamNameFromDomain(
        (app.data as ConfluenceAppData).values.credentials.domain,
      )
      await save(AppModel, app)
      setStatus(Statuses.SUCCESS)
      setError(null)
    } catch (err) {
      setStatus(Statuses.FAIL)
      setError(err.message)
    }
  }

  const handleChange = (prop: keyof AtlassianAppValuesCredentials) => (val: SyntheticEvent) => {
    setCredentials({
      ...credentials,
      [prop]: ((val as SyntheticEvent).target as any).value,
    })
  }

  return (
    <Col tagName="form" onSubmit={addApp}>
      <Message>
        Atlassian requires username and password as their OAuth requires administrator permissions.
        As always with Orbit, this information is <strong>completely private</strong> to you.
      </Message>

      <Space />

      <Form>
        <InputField
          label="Domain"
          value={credentials.domain}
          // !TODO
          onChange={handleChange('domain') as any}
        />
        <InputField
          label="Username"
          value={credentials.username}
          // !TODO
          onChange={handleChange('username') as any}
        />
        <InputField
          label="Password"
          type="password"
          value={credentials.password}
          // !TODO
          onChange={handleChange('password') as any}
        />
        <Space />
        <FormField label="">
          {status === Statuses.LOADING && <Button>Saving...</Button>}
          {status !== Statuses.LOADING && (
            <Button alt="action" onClick={addApp}>
              Add
            </Button>
          )}
        </FormField>
        <Space />
        {error && <Message>{error}</Message>}
      </Form>
    </Col>
  )
}
