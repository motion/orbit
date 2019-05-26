import { AppViewProps, AppView } from '@o/kit'
import { AppBit } from '@o/models'
import React from 'react'

export default function PreviewApp(props: { app: AppBit }) {
  return (
    <AppView
      identifier={props.app.identifier}
      viewType="index"
      appProps={{
        ...appToAppProps(props.app),
        id: `preview-${props.app.id}`,
      }}
    />
  )
}

export function appToAppProps(app: AppBit): AppViewProps {
  return {
    id: `${app.id}`,
    title: app.name,
    identifier: app.identifier,
  }
}
