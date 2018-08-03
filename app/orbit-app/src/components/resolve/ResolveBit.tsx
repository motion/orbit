import * as React from 'react'
import { ResolveConversation } from './resolveBits/ResolveConversation'
import { ResolveDocument } from './resolveBits/ResolveDocument'
import { ResolveMail } from './resolveBits/ResolveMail'
import { ResolveTask } from './resolveBits/ResolveTask'
import { ItemResolverProps } from '../ItemResolver';

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
  confluence: {
    document: ResolveDocument,
  },
  jira: {
    document: ResolveDocument,
  },
}

export const ResolveBit = ({ bit, children, searchTerm, ...props }: ItemResolverProps) => {
  const resolveIntegration = results[bit.integration]
  const Resolver = resolveIntegration && resolveIntegration[bit.type]
  if (!Resolver) {
    console.log('no resolver for', bit.integration, bit.type)
    return () => <div>no resolver</div>
  }
  return (
    <Resolver bit={bit} searchTerm={searchTerm} {...props}>
      {bitProps =>
        children({
          id: bit.id,
          type: 'bit',
          subType: bit.type,
          integration: bit.integration,
          createdAt: bit.bitCreatedAt,
          updatedAt: bit.bitUpdatedAt,
          ...bitProps,
        })
      }
    </Resolver>
  )
}
