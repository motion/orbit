import { AppMainView, AppProps, Icon, removeApp, useApp } from '@o/kit'
import { Section, Title, TitleBarButton, TitleRow } from '@o/ui'
import React from 'react'
import { AppsMainAddApp } from './AppsMainAddApp'
import { ManageApps } from './ManageApps'

export function AppsMain(props: AppProps) {
  const [app] = useApp(+props.subId)

  // showing settings
  if (props.identifier !== 'apps') {
    if (props.subType === 'manage') {
      return <ManageApps />
    }
    if (props.subType === 'sync') {
      return <AppMainView {...props} />
    } else {
      return (
        <Section>
          <TitleRow
            bordered
            before={<Icon opacity={0.2} name="gear" />}
            after={
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
