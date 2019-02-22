import { OrbitSourceSettingProps } from '@mcro/kit'
import { GmailSource } from '@mcro/models'
import { Message } from '@mcro/ui'
import * as React from 'react'

export default function GmailSettings(_: OrbitSourceSettingProps<GmailSource>) {
  return (
    <>
      <Message>Gmail Sync Active</Message>
    </>
  )
}
