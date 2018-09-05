import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekItemResolver } from '../../views/PeekItemResolver'
import { PeekBitPaneProps } from './PeekBitPaneProps'
// import { BitRepository } from '../../../../repositories';
import { Divider } from '../../../../views/Divider'
import { observeMany } from '../../../../repositories'
import { BitModel } from '@mcro/models'
import { ItemResolverDecorationContext } from '../../../../helpers/contexts/ItemResolverDecorationContext'

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
  padding: [10, 0],
})

const decorator = compose(
  view.attach({
    store: PeekConversationStore,
  }),
  view,
)

export const Conversation = decorator(({ store, content }: Props) => {
  return (
    <ItemResolverDecorationContext.Provider
      value={{
        text: null,
        item: {
          padding: [1, 6],
          '&:hover': {
            background: [0, 0, 0, 0.02],
          },
        },
      }}
    >
      <SlackConversation>
        {content || null}
        {store.nextConversations.map((convo, index) => (
          <React.Fragment key={`${convo.id}${index}`}>
            <PeekItemResolver model={convo}>
              {({ content }) => content}
            </PeekItemResolver>
            <Divider />
          </React.Fragment>
        ))}
        <br />
        <br />
      </SlackConversation>
    </ItemResolverDecorationContext.Provider>
  )
})
