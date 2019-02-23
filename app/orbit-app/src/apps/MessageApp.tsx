import { App, AppDefinition } from '@mcro/kit'
import React from 'react'
import { MessageViewMain } from './views/MessageViewMain'

export const id = 'message'

export const app: AppDefinition = {
  name: 'Message',
  icon: '',
  app: props => (
    <App>
      <MessageViewMain {...props.appConfig} />
    </App>
  ),
}
