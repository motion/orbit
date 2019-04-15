import { Theme } from '@o/ui'
import React from 'react'
import { Page } from '../../views/Page'

export function FeetSection(props) {
  return (
    <Theme name="home">
      <Page {...props}>
        <Page.Content>123</Page.Content>

        <Page.Background background="#111" />
      </Page>
    </Theme>
  )
}
