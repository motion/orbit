import { BitSlackConversation } from './slackConversation'
import Document from './document'
import Mail from './mail'
import Task from './task'
import App from './app'
import { PersonCard } from './personCard'
import { Person } from '@mcro/models'
import * as React from 'react'

const results = {
  slack: {
    conversation: BitSlackConversation,
  },
  google: {
    mail: Mail,
    document: Document,
  },
  github: {
    task: Task,
  },
  apps: {
    app: App,
  },
}

export default function getBitContentView(bit): Function {
  if (bit instanceof Person) {
    return PersonCard
  }
  if (!bit.integration || !bit.type) {
    return ({ children }) => children(bit)
  }
  const resolveIntegration = results[bit.integration]
  const resolver = resolveIntegration && resolveIntegration[bit.type]
  if (!resolver) {
    console.log('no resolver for', bit.integration, bit.type)
    return () => <div>no resolver</div>
  }
  return resolver
}
