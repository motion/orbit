import * as React from 'react'
import { ResolveConversation } from './resolve/ResolveConversation'
import { ResolveDocument } from './resolve/ResolveDocument'
import { ResolveMail } from './resolve/ResolveMail'
import { ResolveTask } from './resolve/ResolveTask'
import { ResolveApp } from './resolve/ResolveApp'
import { ResolvePerson } from './resolve/ResolvePerson'
import { Person, Bit } from '@mcro/models'
import { SearchStore } from '../stores/SearchStore'
import { AppStatePeekItem } from '../../../stores/App'

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

const EmptyResolver = ({
  item,
  children,
}: {
  item: AppStatePeekItem
  children: Function
}) =>
  children({
    title: item.title || '',
    body: '',
    subtitle: '',
    location: '',
    icon: item.icon || '',
  })

export type BitResolverProps = {
  bit?: Bit
  item: AppStatePeekItem
  searchStore?: SearchStore
  isExpanded?: boolean
  children: Function | React.ReactNode
  shownLimit?: number
}

export const BitResolver = ({ bit, item, ...props }: BitResolverProps) => {
  let Resolver
  if (!bit) {
    return <EmptyResolver item={item} {...props} />
  }
  if (bit instanceof Person) {
    Resolver = ResolvePerson
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
