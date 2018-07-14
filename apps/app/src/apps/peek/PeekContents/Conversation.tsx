import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../index'
import { SubTitle } from '../../../views'
import { OrbitDivider } from '../../../apps/orbit/orbitDivider'
import { PeekRelatedStore } from './PeekRelatedStore'
import { PeekContentProps } from './PeekContentProps'

const Section = view({
  padding: 20,
})

// delays here help ensure it doesn't jitter

const itemProps = {
  padding: [5, 15],
  '&:hover': {
    background: [0, 0, 0, 0.02],
  },
}

@view.attach({
  relatedStore: PeekRelatedStore,
})
@view
export class Conversation extends React.Component<
  PeekContentProps & {
    relatedStore: PeekRelatedStore
  }
> {
  render() {
    const { relatedStore, bit, appStore, children } = this.props
    if (!bit) {
      return children({})
    }
    return (
      <PeekBitResolver appStore={appStore} bit={bit} itemProps={itemProps}>
        {({ permalink, location, title, icon, content, date }) => {
          return children({
            title,
            subtitle: location,
            icon,
            permalink,
            date,
            content: (
              <>
                {content}
                {relatedStore.relatedConversations.length && (
                  <div>
                    <Section>
                      <SubTitle>Related Conversations</SubTitle>
                    </Section>
                    {relatedStore.relatedConversations.map(
                      (relatedBit, index) => (
                        <React.Fragment key={`${relatedBit.id}${index}`}>
                          <PeekBitResolver
                            appStore={appStore}
                            bit={relatedBit}
                            itemProps={itemProps}
                          >
                            {({ content }) => content}
                          </PeekBitResolver>
                          <OrbitDivider
                            if={index < 2}
                            height={2}
                            css={{ margin: [20, 0, 10] }}
                          />
                        </React.Fragment>
                      ),
                    )}
                    <br />
                    <br />
                  </div>
                )}
              </>
            ),
          })
        }}
      </PeekBitResolver>
    )
  }
}
