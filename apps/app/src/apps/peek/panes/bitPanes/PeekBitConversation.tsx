import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekItemResolver } from '../../views/PeekItemResolver'
import { SubTitle } from '../../../../views'
import { OrbitDivider } from '../../../../apps/orbit/OrbitDivider'
import { PeekRelatedStore } from '../../stores/PeekRelatedStore'
import * as UI from '@mcro/ui'
import { PeekBitPaneProps } from './PeekBitPaneProps'

const Section = view({
  padding: [10, 16, 0],
})

const bitResolverProps = {
  itemProps: {
    padding: [5, 16],
    '&:hover': {
      background: [0, 0, 0, 0.02],
    },
  },
}

const decorator = compose(
  view.attach({
    relatedStore: PeekRelatedStore,
  }),
  view,
)

type Props = PeekBitPaneProps & {
  relatedStore: PeekRelatedStore
}

export const Conversation = decorator(({ relatedStore, content }: Props) => {
  return (
    <>
      {content}
      {relatedStore.relatedConversations.length ? (
        <UI.View marginTop={20} background="#fefefe">
          <Section>
            <SubTitle>After</SubTitle>
          </Section>
          {relatedStore.relatedConversations.map((relatedBit, index) => (
            <React.Fragment key={`${relatedBit.id}${index}`}>
              <PeekItemResolver bit={relatedBit} {...bitResolverProps}>
                {({ content }) => content}
              </PeekItemResolver>
              {index < 2 && (
                <OrbitDivider css={{ height: 2, margin: [20, 0, 10] }} />
              )}
            </React.Fragment>
          ))}
          <br />
          <br />
        </UI.View>
      ) : null}
    </>
  )
})

Conversation.bitResolverProps = bitResolverProps
