import { AppSettingsProps } from '@mcro/kit'
import { GmailSource } from '@mcro/models'
import { Message } from '@mcro/ui'
import * as React from 'react'

export default function GmailSettings(_: AppSettingsProps<GmailSource>) {
  return (
    <>
      <Message>Gmail Sync Active</Message>
    </>
  )
}
