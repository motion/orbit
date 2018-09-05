import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekItemResolver } from '../../views/PeekItemResolver'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import { Divider } from '../../../../views/Divider'
import { observeMany } from '../../../../repositories'
import { BitModel } from '@mcro/models'
import { SubTitle, VerticalSpace } from '../../../../views'

type Props = PeekBitPaneProps & {
  store: PeekConversationStore
}

class PeekConversationStore {
  props: Props

  nextConversations = []
  nextConversations$ = observeMany(BitModel, {
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
  padding: 15,
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
          <VerticalSpace />
          <SubTitle>Next conversations:</SubTitle>
          <VerticalSpace />
        </>
      )}
      {store.nextConversations.map((convo, index) => (
        <React.Fragment key={`${convo.id}${index}`}>
          <PeekItemResolver model={convo}>
            {({ content }) => <Unpad>{content}</Unpad>}
          </PeekItemResolver>
          <Divider />
        </React.Fragment>
      ))}
      <br />
      <br />
    </SlackConversation>
  )
})
