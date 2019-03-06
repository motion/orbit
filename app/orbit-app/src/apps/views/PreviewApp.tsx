import { AppView } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import React from 'react'
import { appToAppConfig } from '../../helpers/appToAppConfig'

export default function PreviewApp(props: { app: AppBit }) {
  return (
    <AppView
      identifier={props.app.identifier}
      viewType="index"
      appConfig={{
        ...appToAppConfig(props.app),
        id: `preview-${props.app.id}`,
      }}
    />
  )
}
