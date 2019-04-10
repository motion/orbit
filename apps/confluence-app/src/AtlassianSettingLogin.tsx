import { AppBit, AppModel, AppProps, save, useActiveSpace, useAppBit } from '@o/kit'
import { Form, Message, Space } from '@o/ui'
import React from 'react'
import { ConfluenceLoader } from './ConfluenceLoader'
import { ConfluenceAppData } from './ConfluenceModels'

const extractTeamNameFromDomain = (domain: string) => {
  return domain
    .replace('http://', '')
    .replace('https://', '')
    .replace('.atlassian.net/', '')
    .replace('.atlassian.net', '')
}

export function AtlassianSettingLogin(props: AppProps) {
  const [activeSpace] = useActiveSpace()
  const [app] = useAppBit(+props.id)

  const addApp = async values => {
    app.data.values = {
      ...app.data.values,
      ...values,
    }
    app.spaces = app.spaces || []
    if (!app.spaces.find(space => space.id === activeSpace.id)) {
      app.spaces.push(activeSpace)
    }
    app.spaceId = activeSpace.id
    // save app
    try {
      const loader = new ConfluenceLoader(app as AppBit)
      await loader.test()
      app.name = extractTeamNameFromDomain(
        (app.data as ConfluenceAppData).values.credentials.domain,
      )
      await save(AppModel, app)
      return true
    } catch (err) {
      return err.message
    }
  }

  return (
    <>
      <Message>
        Atlassian requires username and password as their OAuth requires administrator permissions.
        As always with Orbit, this information is <strong>completely private</strong> to you.
      </Message>
      <Space />
      <Form
        submitButton
        onSubmit={addApp}
        fields={{
          Domain: {
            name: 'Domain',
            required: true,
          },
          Username: {
            name: 'Username',
            required: true,
          },
          Password: {
            name: 'Password',
            required: true,
          },
        }}
      />
    </>
  )
}
