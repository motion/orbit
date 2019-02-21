import { AppBit } from '@mcro/models'
import { BorderLeft, Title } from '@mcro/ui'
import React from 'react'
import { appToAppConfig } from '../../helpers/appToAppConfig'
import { Section } from '../../views/Section'
import { AppView } from '../AppView'

export default function PreviewApp(props: { app: AppBit }) {
  return (
    <>
      <BorderLeft />
      <Section paddingBottom={0}>
        <Title>Preview</Title>
      </Section>
      <AppView
        viewType="index"
        id={`preview-${props.app.id}`}
        type={props.app.type}
        appConfig={{
          ...appToAppConfig(props.app),
          id: `preview-${props.app.id}`,
        }}
      />
    </>
  )
}
