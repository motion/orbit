import * as React from 'react'
import { view, react } from '@mcro/black'
import { PeekBitResolver, PeekHeader, PeekContent } from '../index'
import { BitResolver } from '../../../components/BitResolver'
import { Carousel } from '../../../components/Carousel'
import { SubTitle } from '../../../views'
import { OrbitDivider } from '../../../apps/orbit/orbitDivider'
import { Bit, Person } from '@mcro/models'
import * as UI from '@mcro/ui'

// delays here help ensure it doesn't jitter

class ConversationPeekStore {
  related = react(
    async () => {
      const people = await Person.find({ take: 3, skip: 7 })
      const bits = await Bit.find({ take: 3, relations: ['people'] })
      return [...people, ...bits]
    },
    { defaultValue: [], delay: 40 },
  )

  relatedConversations = react(
    async () =>
      await Bit.find({
        relations: ['people'],
        where: { integration: 'slack', type: 'conversation' },
        take: 3,
      }),
    { defaultValue: [], delay: 40 },
  )
}

const itemProps = {
  padding: [2, 10],
  hover: {
    background: 'red',
  },
}

@view.attach({
  store: ConversationPeekStore,
})
@view
export class Conversation extends React.Component {
  render({ store, bit, appStore }) {
    if (!bit) {
      return null
    }
    return (
      <PeekBitResolver appStore={appStore} bit={bit} itemProps={itemProps}>
        {({ permalink, location, title, icon, content }) => {
          return (
            <>
              <PeekHeader
                title={title}
                subtitle={location}
                icon={icon}
                permalink={permalink}
              />
              <PeekContent>
                {content}

                <SubTitle>Related</SubTitle>
                <carouselInner>
                  <UI.Theme name="light">
                    <Carousel items={store.related} />
                  </UI.Theme>
                </carouselInner>

                <SubTitle>Related Conversations</SubTitle>
                {store.relatedConversations.map((relatedBit, index) => (
                  <React.Fragment key={`${relatedBit.id}${index}`}>
                    <BitResolver
                      appStore={appStore}
                      bit={relatedBit}
                      shownLimit={Infinity}
                      itemProps={slackConvoBitContentStyle}
                      isExpanded
                    >
                      {({ content }) => content}
                    </BitResolver>
                    <OrbitDivider
                      if={index < 2}
                      height={2}
                      css={{ margin: [20, 0, 10] }}
                    />
                  </React.Fragment>
                ))}
                <br />
                <br />
              </PeekContent>
            </>
          )
        }}
      </PeekBitResolver>
    )
  }
}
