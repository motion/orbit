import { AppMainView, AppProps, ManageSyncStatus, useApp } from '@o/kit'
import { Row, Section } from '@o/ui'
import * as React from 'react'

export function GmailSettings(props: AppProps) {
  const [app] = useApp(+props.subId)
  return (
    <Section flex={1}>
      <Row width="100%" alignItems="center">
        {app && <ManageSyncStatus app={app} />}
      </Row>
      <AppMainView
        identifier="message"
        title="Gmail"
        subType={`${app ? app.name : ''}`}
        viewType="main"
        icon="gmail"
      />
    </Section>
  )
}
