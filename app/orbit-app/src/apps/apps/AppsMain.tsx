import { AppMainView, AppProps, removeApp, useApp } from '@o/kit'
import { Section, Title, TitleBarButton } from '@o/ui'
import React from 'react'
import { AppsMainAddApp } from './AppsMainAddApp'

export function AppsMain(props: AppProps) {
  const [app] = useApp(+props.subId)

  // showing settings
  if (props.identifier !== 'apps') {
    if (props.subType === 'sync') {
      return <AppMainView {...props} viewType="settings" />
    } else {
      return (
        <Section
          bordered
          icon="gear"
          title={props.title}
          afterTitle={
            app &&
            app.tabDisplay !== 'permanent' && (
              <TitleBarButton
                icon="boldremove"
                tooltip={`Remove ${props.title}`}
                onClick={() => removeApp(app)}
              />
            )
          }
        >
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
