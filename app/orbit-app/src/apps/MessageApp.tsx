import { App, createApp } from '@o/kit'
import React from 'react'

import { MessageViewMain } from './views/MessageViewMain'

export default createApp({
  id: 'message',
  name: 'Message',
  icon: '',
  app: props => (
    <App>
      <MessageViewMain {...props} />
    </App>
  ),
})
