import { AppMainView, ManageSyncStatus, useApp } from '@o/kit'
import { Section, Stack } from '@o/ui'
import * as React from 'react'

export function GmailSettings() {
  const app = useApp()
  return (
    <Section padding flex={1}>
      <Stack direction="horizontal" width="100%" alignItems="center">
        {app && <ManageSyncStatus app={app} />}
      </Stack>
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
