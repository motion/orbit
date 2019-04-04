import { AppBit, AppModel, save, useActiveSpace } from '@o/kit'
import { Form, Message, Space } from '@o/ui'
import React, { useState } from 'react'
import { ConfluenceLoader } from './ConfluenceLoader'
import { ConfluenceAppData } from './ConfluenceModels'

type Props = {
  identifier: string
  app?: AppBit
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
  const [app] = useState<Partial<AppBit>>({
    target: 'app',
    identifier: props.identifier as 'confluence',
    token: '',
    data: (props.app && props.app.data) || {},
  })

  // todo: remove it
  // load something from confluence (testing api)
  // useEffect(() => {
  //   loadOne(AppModel, { args: { where: { identifier: 'confluence', tabDisplay: 'plain' } } }).then(
  //     app => {
  //       if (app) {
  //         confluenceApp
  //           .api(app)
  //           .loadUsers()
  //           .then(users => console.log('users', users))
  //       }
  //     },
  //   )
  // }, [])

  const addApp = async values => {
    Object.assign(app.data.values, values)
    if (!app.spaces) {
      app.spaces = []
    }
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
        fields={[
          {
            name: 'Domain',
            type: 'string',
            required: true,
          },
          {
            name: 'Username',
            type: 'string',
            required: true,
          },
          {
            name: 'Password',
            type: 'string',
            required: true,
          },
        ]}
      />
    </>
  )
}
