import { BitSlackConversation } from './bitResolvers/slackConversation'
import Document from './bitResolvers/document'
import Mail from './bitResolvers/mail'
import Task from './bitResolvers/task'
import App from './bitResolvers/app'
import { PersonCard } from './bitResolvers/personCard'
import { Person } from '@mcro/models'
import * as React from 'react'

const results = {
  slack: {
    conversation: BitSlackConversation,
  },
  gdocs: {
    document: Document,
  },
  gmail: {
    mail: Mail,
  },
  github: {
    task: Task,
  },
  apps: {
    app: App,
  },
  confluence: {
    document: Document,
  },
  jira: {
    document: Document,
  },
}

const EmptyResolver = ({ children }) =>
  children({
    title: '',
    body: '',
    subtitle: '',
    location: '',
    icon: '',
  })

export function BitResolver({ bit, ...props }) {
  let Resolver
  if (!bit) {
    return EmptyResolver
  }
  if (bit instanceof Person) {
    Resolver = PersonCard
  } else if (!bit.integration || !bit.type) {
    Resolver = ({ children }) => children(bit)
  } else {
    const resolveIntegration = results[bit.integration]
    Resolver = resolveIntegration && resolveIntegration[bit.type]
    if (!Resolver) {
      console.log('no resolver for', bit.integration, bit.type)
      Resolver = () => <div>no resolver</div>
    }
  }
  return <Resolver bit={bit} {...props} />
}
