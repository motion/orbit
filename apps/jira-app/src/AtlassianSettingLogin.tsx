import { AppBit, AppModel, AppProps, save, useActiveSpace, useAppBit } from '@o/kit'
import { Form } from '@o/ui'
import React from 'react'

import { JiraLoader } from './JiraLoader'
import { JiraAppData } from './JiraModels'

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

  return (
    <Form
      submitButton
      onSubmit={async values => {
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
          const loader = new JiraLoader(app as AppBit)
          await loader.test()
          app.name = extractTeamNameFromDomain((app.data as JiraAppData).values.credentials.domain)
          await save(AppModel, app)
          return true
        } catch (err) {
          return err.message
        }
      }}
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
  )
}
