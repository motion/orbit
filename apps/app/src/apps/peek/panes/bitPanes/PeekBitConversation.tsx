import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../../views/PeekBitResolver'
import { SubTitle } from '../../../../views'
import { OrbitDivider } from '../../../../apps/orbit/OrbitDivider'
import { PeekRelatedStore } from '../../stores/PeekRelatedStore'
import * as UI from '@mcro/ui'
import { PeekBitPaneProps } from './PeekBitPaneProps'

const Section = view({
  padding: 20,
})

const bitResolverProps = {
  itemProps: {
    padding: [4, 15],
    '&:hover': {
      background: [0, 0, 0, 0.02],
    },
  },
}

@view.attach({
  relatedStore: PeekRelatedStore,
})
@view
export class Conversation extends React.Component<
  PeekBitPaneProps & {
    relatedStore: PeekRelatedStore
  }
> {
  static bitResolverProps = bitResolverProps

  render() {
    const { relatedStore, appStore, content } = this.props
    return (
      <>
        {content}
        {relatedStore.relatedConversations.length ? (
          <UI.View marginTop={60} background="#f5f5f5">
            <Section>
              <SubTitle>Related Conversations</SubTitle>
            </Section>
            {relatedStore.relatedConversations.map((relatedBit, index) => (
              <React.Fragment key={`${relatedBit.id}${index}`}>
                <PeekBitResolver
                  appStore={appStore}
                  bit={relatedBit}
                  itemProps={bitResolverProps}
                >
                  {({ content }) => content}
                </PeekBitResolver>
                {index < 2 && (
                  <OrbitDivider height={2} css={{ margin: [20, 0, 10] }} />
                )}
              </React.Fragment>
            ))}
            <br />
            <br />
          </UI.View>
        ) : null}
      </>
    )
  }
}
