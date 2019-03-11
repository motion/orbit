import { AppMainView, AppProps } from '@o/kit'
import { Section, Title } from '@o/ui'
import React from 'react'
import { AppsMainAddApp } from './AppsMainAddApp'

export function AppsMain(props: AppProps) {
  if (props.identifier !== 'apps') {
    return (
      <Section>
        <Title>Settings: {props.title}</Title>
        <AppMainView {...props} />
      </Section>
    )
  }

  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId} />
  }

  return <Title>hi</Title>
}
