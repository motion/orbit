import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekItemResolver } from '../../views/PeekItemResolver'
import { PeekBitPaneProps } from './PeekBitPaneProps'
// import { BitRepository } from '../../../../repositories';
import { Divider } from '../../../../views/Divider'

const bitResolverProps = {
  itemProps: {
    padding: [1, 6],
    '&:hover': {
      background: [0, 0, 0, 0.02],
    },
  },
}

class PeekConversationStore {
  nextConversations = []

  async didMount() {
    // this.nextConversations = await BitRepository.find({
    //   where: {
    //     bitCreatedAt: {
    //       $gt: Date.now()
    //     }
    //   }
    // })
  }
}

const decorator = compose(
  view.attach({
    store: PeekConversationStore,
  }),
  view,
)

type Props = PeekBitPaneProps & {
  store: PeekConversationStore
}

export const Conversation = decorator(({ store, content }: Props) => {
  return (
    <>
      {content || null}
      {store.nextConversations.map((convo, index) => (
        <React.Fragment key={`${convo.id}${index}`}>
          <PeekItemResolver model={convo} {...bitResolverProps}>
            {({ content }) => content}
          </PeekItemResolver>
          <Divider />
        </React.Fragment>
      ))}
      <br />
      <br />
    </>
  )
})

Conversation.bitResolverProps = bitResolverProps
