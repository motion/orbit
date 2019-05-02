import { AppMainView, AppProps, removeApp, useAppBit } from '@o/kit'
import { Button, FormField, Section, SubSection, Title } from '@o/ui'
import React from 'react'

import { AppsMainAddApp } from './AppsMainAddApp'
import { AppsMainNew } from './AppsMainNew'

export function AppsMain(props: AppProps) {
  const [app] = useAppBit(+props.subId)

  console.log('got app', app)

  if (!app) {
    return null
  }

  // showing settings
  if (props.identifier && props.identifier !== 'apps') {
    if (props.subType === 'sync') {
      return <AppMainView {...props} viewType="settings" />
    } else {
      return (
        <Section
          backgrounded
          titleBorder
          padInner
          icon="cog"
          title={props.title}
          afterTitle={
            app &&
            app.tabDisplay !== 'permanent' && (
              <Button
                icon="cross"
                tooltip={`Remove ${props.title}`}
                onClick={() => removeApp(app)}
              />
            )
          }
        >
          <Section pad={{ bottom: true }}>
            <FormField label="Name and Icon">
              <AppsMainNew />
            </FormField>
          </Section>

          <Section pad={{ bottom: true }}>
            <SubSection title="App Settings">
              <AppMainView {...props} viewType="settings" />
            </SubSection>
          </Section>

          <Section bordered title="Preview" minHeight={200}>
            preview
            {/* <PreviewApp app={app} /> */}
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
