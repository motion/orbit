import { AppView } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import { BorderLeft, Section, Title } from '@mcro/ui'
import React from 'react'
import { appToAppConfig } from '../../helpers/appToAppConfig'

export default function PreviewApp(props: { app: AppBit }) {
  return (
    <>
      <BorderLeft />
      <Section paddingBottom={0}>
        <Title>Preview</Title>
      </Section>
      <AppView
        identifier={props.app.identifier}
        viewType="index"
        appConfig={{
          ...appToAppConfig(props.app),
          id: `preview-${props.app.id}`,
        }}
      />
    </>
  )
}
