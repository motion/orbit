import { App, AppDefinition } from '@o/kit'
import React from 'react'
import { MessageViewMain } from './views/MessageViewMain'

export const MessageApp: AppDefinition = {
  id: 'message',
  name: 'Message',
  icon: '',
  app: props => (
    <App>
      <MessageViewMain {...props} />
    </App>
  ),
}
