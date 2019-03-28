import { AppMainView, AppProps, ManageSyncStatus, useApp } from '@o/kit'
import { Row, Section } from '@o/ui'
import * as React from 'react'
import { useEffect } from 'react'
import gmailApp from './index'

export function GmailSettings(props: AppProps) {
  const [app] = useApp(+props.subId)

  // todo: remove it
  // load gmail profile (testing api)
  useEffect(
    () => {
      if (app) {
        gmailApp
          .api(app)
          .getProfile({ userId: 'me' })
          .then(profile => console.log('user profile', profile))
      }
    },
    [app],
  )

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
