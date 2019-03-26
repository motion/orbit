import { AppModel, AppProps, save, useActiveSpace, useModel } from '@o/kit'
import { Button, Col, Form, InputField, Message, Space, Theme } from '@o/ui'
import * as React from 'react'
import { SyntheticEvent } from 'react'
import { PostgresAppData } from './PostgresModels'

type Props = {
  identifier: string
  app?: AppProps
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

export function PostgresSettings({ app }: Props) {
  const [activeSpace] = useActiveSpace()
  let [appBit] = useModel(
    AppModel,
    app && app.subId
      ? {
          where: {
            id: +app.subId,
          },
        }
      : false,
    {
      defaultValue: {
        target: 'app',
        identifier: 'postgres',
        token: '',
        data: {},
      },
    },
  )
  const [status, setStatus] = React.useState('')
  const [error, setError] = React.useState('')
  const [credentials, setCredentials] = React.useState({
    hostname: '',
    username: '',
    password: '',
    port: '',
    database: '',
  } as PostgresAppData['credentials'])

  React.useEffect(
    () => {
      const appData: PostgresAppData = appBit.data
      if (appData.credentials) {
        setCredentials(appData.credentials)
      }
    },
    [appBit],
  )

  console.log('credentials', credentials)

  const addApp = async e => {
    e.preventDefault()
    appBit.data = { credentials }
    if (!appBit.spaces) {
      appBit.spaces = []
    }
    if (!appBit.spaces.find(space => space.id === activeSpace.id)) {
      appBit.spaces.push(activeSpace)
    }
    appBit.spaceId = activeSpace.id
    appBit.name = `Postgres on ${credentials.database}@${credentials.hostname}`

    // send command to the desktop
    setStatus(Statuses.LOADING)

    // save app
    try {
      await save(AppModel, appBit)
      setStatus(Statuses.SUCCESS)
      setError(null)
    } catch (err) {
      setStatus(Statuses.FAIL)
      setError(err.message)
    }
  }

  const handleChange = (prop: keyof PostgresAppData['credentials']) => (val: SyntheticEvent) => {
    setCredentials({
      ...credentials,
      [prop]: ((val as SyntheticEvent).target as any).value,
    })
  }

  return (
    <Col tagName="form" onSubmit={addApp}>
      <Message>Please enter postgres database connection credentials.</Message>
      <Space />
      <Col margin="auto" width={370}>
        <Col>
          <Form>
            <InputField
              label="Hostname"
              value={credentials.hostname}
              // !TODO
              onChange={handleChange('hostname') as any}
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
            <InputField
              label="Port"
              value={credentials.port}
              // !TODO
              onChange={handleChange('port') as any}
            />
            <InputField
              label="Database"
              value={credentials.database}
              // !TODO
              onChange={handleChange('database') as any}
            />
          </Form>
          <Space />
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
          <Space />
          {error && <Message>{error}</Message>}
        </Col>
      </Col>
    </Col>
  )
}
