import * as React from 'react'
import { ResolveConversation } from './resolveBits/ResolveConversation'
import { ResolveDocument } from './resolveBits/ResolveDocument'
import { ResolveMail } from './resolveBits/ResolveMail'
import { ResolveTask } from './resolveBits/ResolveTask'
import { ItemResolverProps } from '../ItemResolver'
import { Bit } from '@mcro/models'

const results = {
  slack: {
    conversation: ResolveConversation,
  },
  gdrive: {
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

export type BitItemResolverProps = ItemResolverProps & { bit: Bit }

export const ResolveBit = ({
  model,
  children,
  searchTerm,
  ...props
}: ItemResolverProps & { model: Bit }) => {
  const resolveIntegration = results[model.integration]
  const Resolver = resolveIntegration && resolveIntegration[model.type]
  if (!Resolver) {
    console.log('no resolver for', model.integration, model.type)
    return () => <div>no resolver</div>
  }
  return (
    <Resolver bit={model} searchTerm={searchTerm} {...props}>
      {bitProps =>
        children({
          id: model.id,
          type: 'bit',
          subType: model.type,
          integration: model.integration,
          createdAt: new Date(model.bitCreatedAt),
          updatedAt: new Date(model.bitUpdatedAt),
          ...bitProps,
        })
      }
    </Resolver>
  )
}
