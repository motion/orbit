import { ResolveConversation } from './resolve/ResolveConversation'
import { ResolveDocument } from './resolve/ResolveDocument'
import { ResolveMail } from './resolve/ResolveMail'
import { ResolveTask } from './resolve/ResolveTask'
import { ResolveApp } from './resolve/ResolveApp'
import { ResolvePerson } from './resolve/ResolvePerson'
import { Person } from '@mcro/models'
import * as React from 'react'

const results = {
  slack: {
    conversation: ResolveConversation,
  },
  gdocs: {
    document: ResolveDocument,
  },
  gmail: {
    mail: ResolveMail,
  },
  github: {
    task: ResolveTask,
  },
  apps: {
    app: ResolveApp,
  },
  confluence: {
    document: ResolveDocument,
  },
  jira: {
    document: ResolveDocument,
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
    Resolver = ResolvePerson
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
