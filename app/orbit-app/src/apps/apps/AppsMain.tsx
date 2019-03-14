import { AppMainView, AppProps, Icon, useApp } from '@o/kit'
import { removeApp } from '@o/kit-internal'
import { Section, Title, TitleBarButton, TitleRow } from '@o/ui'
import React from 'react'
import { AppsMainAddApp } from './AppsMainAddApp'

export function AppsMain(props: AppProps) {
  const [app] = useApp(+props.subId)

  // showing settings
  if (props.identifier !== 'apps') {
    if (props.subType === 'sync') {
      return <AppMainView {...props} />
    } else {
      return (
        <Section>
          <TitleRow
            bordered
            before={<Icon opacity={0.2} name="gear" />}
            after={
              <TitleBarButton
                icon="boldremove"
                tooltip={`Remove ${props.title}`}
                onClick={() => removeApp(app)}
              />
            }
          >
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
