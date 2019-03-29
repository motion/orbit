import { AppMainView, AppProps, removeApp, useApp } from '@o/kit'
import { FormField, Section, Title, TitleBarButton } from '@o/ui'
import React from 'react'
import { SubSection } from '../../views/SubSection'
import PreviewApp from '../views/PreviewApp'
import { AppsMainAddApp } from './AppsMainAddApp'
import { AppsMainNew } from './AppsMainNew'

export function AppsMain(props: AppProps) {
  const [app] = useApp(+props.subId)

  if (!app) {
    return null
  }

  // showing settings
  if (props.identifier !== 'apps') {
    if (props.subType === 'sync') {
      return <AppMainView {...props} viewType="settings" />
    } else {
      return (
        <Section
          titleBorder
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
          <Section padded>
            <FormField label="Name and Icon">
              <AppsMainNew />
            </FormField>
          </Section>

          <Section padded>
            <SubSection title="App Settings">
              <AppMainView {...props} />
            </SubSection>
          </Section>

          <Section bordered title="Preview" minHeight={200}>
            <PreviewApp app={app} />
          </Section>
        </Section>
      )
    }
  }

  if (props.subType === 'add-app') {
    return <AppsMainAddApp identifier={props.subId} />
  }

  return <Title>hi</Title>
}
