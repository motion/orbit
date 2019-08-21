import { useModels } from '@o/bridge'
import { Bit, BitModel } from '@o/models'
import { ChatMessages, Col, Section } from '@o/ui'
import * as React from 'react'

import { AppBitMainProps } from '../types/AppTypes'

const ConvoGroup = ({ bits }: { bits: Bit[] }) => {
  return (
    <Col space>
      {(bits || []).map(bit => {
        return <ChatMessages key={bit.id} messages={bit.data.messages} people={bit.people} />
      })}
    </Col>
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
    <Section flex={1} space>
      <ConvoGroup bits={prevConvos.reverse()} />
      {!!props.item && <ChatMessages messages={props.item.data.messages} />}
    </Section>
  )
}
