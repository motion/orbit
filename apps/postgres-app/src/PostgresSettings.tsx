import { AppModel, AppProps, save, useActiveSpace, useAppBit } from '@o/kit'
import { Form } from '@o/ui'
import * as React from 'react'

export function PostgresSettings(props: AppProps) {
  const [activeSpace] = useActiveSpace()
  const [app] = useAppBit(+props.id)

  return (
    <Form
      submitButton
      onSubmit={async values => {
        app.data.credentials = values
        app.spaces = app.spaces || []
        if (!app.spaces.find(space => space.id === activeSpace.id)) {
          app.spaces.push(activeSpace)
        }
        app.spaceId = activeSpace.id
        try {
          await save(AppModel, app)
          return true
        } catch (err) {
          return err.message
        }
      }}
      fields={{
        hostname: {
          name: 'Hostname',
          required: true,
        },
        username: {
          name: 'Username',
          required: true,
        },
        password: {
          name: 'Password',
          required: true,
        },
        port: {
          name: 'Port',
          required: true,
        },
        database: {
          name: 'Database',
          required: true,
        },
      }}
    />
  )
}
