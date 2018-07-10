import * as React from 'react'
import { view, react } from '@mcro/black'
import { PeekBitResolver } from '../index'
import { OrbitCardMasonry } from '../../../apps/orbit/OrbitCardMasonry'
import { SubTitle } from '../../../views'
import { OrbitDivider } from '../../../apps/orbit/orbitDivider'
import { Bit, Person } from '@mcro/models'
import * as UI from '@mcro/ui'

const Section = view({
  padding: 20,
})

// delays here help ensure it doesn't jitter

class ConversationPeekStore {
  related = react(
    async () => {
      const people = await Person.find({ take: 3, skip: 7 })
      const bits = await Bit.find({ take: 3, skip: 2, relations: ['people'] })
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
        skip: 2,
      }),
    { defaultValue: [], delay: 40 },
  )
}

const itemProps = {
  padding: [5, 15],
  hover: {
    background: [0, 0, 0, 0.02],
  },
}

@view.attach({
  store: ConversationPeekStore,
})
@view
export class Conversation extends React.Component {
  render({ store, bit, appStore, children }) {
    if (!bit) {
      return children({})
    }
    return (
      <PeekBitResolver appStore={appStore} bit={bit} itemProps={itemProps}>
        {({ permalink, location, title, icon, content }) => {
          return children({
            title,
            subtitle: location,
            icon,
            permalink,
            content: (
              <>
                {content}
                <Section>
                  <SubTitle>Related</SubTitle>
                  <UI.Theme name="grey">
                    <OrbitCardMasonry items={store.related} />
                  </UI.Theme>
                </Section>
                <Section>
                  <SubTitle>Related Conversations</SubTitle>
                </Section>
                {store.relatedConversations.map((relatedBit, index) => (
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
                ))}
                <br />
                <br />
              </>
            ),
          })
        }}
      </PeekBitResolver>
    )
  }
}
