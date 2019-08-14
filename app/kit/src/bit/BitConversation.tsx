import { useModels } from '@o/bridge'
import { Bit, BitModel } from '@o/models'
import { ChatMessages, Section } from '@o/ui'
import * as React from 'react'

import { AppBitMainProps } from '../types/AppTypes'
import { BitStatusBar } from '../views/BitStatusBar'

const ConvoGroup = ({ bits }: { bits: Bit[] }) => {
  return (
    <>
      {(bits || []).map(bit => {
        return <ChatMessages key={bit.id} messages={bit.data.messages} people={bit.people} />
      })}
    </>
  )
}

export function BitConversation(props: AppBitMainProps) {
  const { item } = props
  const [prevConvos] = useModels(BitModel, {
    where: {
      app: item.app,
      type: item.type,
      location: {
        name: item.location.name,
      },
      bitCreatedAt: {
        $lessThan: item.bitCreatedAt,
      },
    },
    relations: ['people'],
    take: 5,
    order: {
      bitCreatedAt: 'DESC',
    },
  })

  return (
    <>
      <Section flex={1} padding scrollable="y" space>
        <ConvoGroup bits={prevConvos.reverse()} />
        {!!props.item && <ChatMessages messages={props.item.data.messages} />}
      </Section>
      <BitStatusBar {...props} />
    </>
  )
}
