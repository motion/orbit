import { AppMainView, AppProps, Icon } from '@o/kit'
import { Section, Title, TitleRow } from '@o/ui'
import React from 'react'
import { AppsMainAddApp } from './AppsMainAddApp'

export function AppsMain(props: AppProps) {
  // showing settings
  if (props.identifier !== 'apps') {
    if (props.subType === 'sync') {
      return <AppMainView {...props} />
    } else {
      return (
        <Section>
          <TitleRow bordered before={<Icon opacity={0.2} name="gear" />}>
            {props.title}
          </TitleRow>
          <AppMainView {...props} />
        </Section>
      )
    }
  }

  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId} />
  }

  return <Title>hi</Title>
}
