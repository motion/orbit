import { AppMainView, AppProps, removeApp, useAppBit } from '@o/kit'
import { FormField, Section, SubSection, Title, TitleBarButton } from '@o/ui'
import React from 'react'
import { AppsMainAddApp } from './AppsMainAddApp'
import { AppsMainNew } from './AppsMainNew'

export function AppsMain(props: AppProps) {
  const [app] = useAppBit(+props.subId)

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
          titleBorder
          padInner
          icon="cog"
          title={props.title}
          afterTitle={
            app &&
            app.tabDisplay !== 'permanent' && (
              <TitleBarButton
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
