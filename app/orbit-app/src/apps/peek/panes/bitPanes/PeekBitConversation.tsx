import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekItemResolver } from '../../views/PeekItemResolver'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import { Divider } from '../../../../views/Divider'
import { observeMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { SubTitle, VerticalSpace } from '../../../../views'

type Props = PeekBitPaneProps & {
  store: PeekConversationStore
}

class PeekConversationStore {
  props: Props

  nextConversations = []
  private nextConversations$ = observeMany(BitModel, {
    args: {
      where: {
        integration: this.props.bit.integration,
        type: this.props.bit.type,
        bitCreatedAt: {
          $moreThan: this.props.bit.bitCreatedAt,
        },
      },
      relations: ['people'],
      take: 5,
      order: {
        bitCreatedAt: 'DESC',
      },
    },
  }).subscribe(values => {
    this.nextConversations = values
  })

  willUnmount() {
    this.nextConversations$.unsubscribe()
  }
}

const SlackConversation = view({
  padding: [0, 15, 15],
})

const Unpad = view({
  margin: [0, -15],
})

const decorator = compose(
  view.attach({
    store: PeekConversationStore,
  }),
  view,
)

export const Conversation = decorator(({ store, content }: Props) => {
  return (
    <SlackConversation>
      <Unpad>{content || null}</Unpad>
      {!!store.nextConversations.length && (
        <>
          <Divider />
          <SubTitle>Related & nearby</SubTitle>
          <VerticalSpace small />
        </>
      )}
      {store.nextConversations.map((convo, index) => (
        <React.Fragment key={`${convo.id}${index}`}>
          <PeekItemResolver model={convo}>
            {({ content }) => <Unpad>{content}</Unpad>}
          </PeekItemResolver>
          {index !== store.nextConversations.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      <VerticalSpace />
      <VerticalSpace />
    </SlackConversation>
  )
})
