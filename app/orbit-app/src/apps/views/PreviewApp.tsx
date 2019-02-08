import { AppBit, AppType } from '@mcro/models'
import React from 'react'
import { appToAppConfig } from '../../helpers/appToAppConfig'
import { Title } from '../../views'
import { BorderLeft } from '../../views/Border'
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
        id={`${props.app.id}`}
        type={AppType[props.app.type]}
        appConfig={appToAppConfig(props.app)}
      />
    </>
  )
}
