import * as React from 'react'
import { ResolveConversation } from './resolveBits/ResolveConversation'
import { ResolveDocument } from './resolveBits/ResolveDocument'
import { ResolveCustom } from './resolveBits/ResolveCustom'
import { ResolveMail } from './resolveBits/ResolveMail'
import { ResolveTask } from './resolveBits/ResolveTask'
import { ItemResolverResolverProps } from '../ItemResolver'
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
  app1: {
    custom: ResolveCustom,
  },
}

export type BitItemResolverProps = ItemResolverResolverProps<Bit>
export type BitItemResolver = React.SFC<BitItemResolverProps & { bit: Bit }>

export const ResolveBit = ({
  model,
  children,
  searchTerm,
  ...props
}: ItemResolverResolverProps<Bit>) => {
  const resolveIntegration = results[model.integration]
  const Resolver = resolveIntegration && (resolveIntegration[model.type] as BitItemResolver)
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
