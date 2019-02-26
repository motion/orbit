import { AppSettingsProps } from '@mcro/kit'
import { GmailApp } from '@mcro/models'
import { Message } from '@mcro/ui'
import * as React from 'react'

export default function GmailSettings(_: AppSettingsProps<GmailApp>) {
  return (
    <>
      <Message>Gmail Sync Active</Message>
    </>
  )
}
