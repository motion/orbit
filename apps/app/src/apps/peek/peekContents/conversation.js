import * as React from 'react'
import { view, react } from '@mcro/black'
import { PeekHeader } from '../peekHeader'
import bitContents from '~/components/bitContents'
import { OrbitIcon } from '~/apps/orbit/orbitIcon'
import { Carousel } from '~/components/carousel'
import { SubTitle } from '~/views'
import { OrbitDivider } from '~/apps/orbit/orbitDivider'
import { Bit, Person } from '@mcro/models'
import * as UI from '@mcro/ui'

// delays here help ensure it doesn't jitter

class ConversationPeek {
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

const slackConvoBitContentStyle = {
  contentStyle: {
    paddingLeft: 17,
  },
}

@view({
  store: ConversationPeek,
})
export class Conversation {
  render({ store, bit, appStore }) {
    if (!bit) {
      return null
    }
    const BitContent = bitContents(bit)
    return (
      <BitContent
        appStore={appStore}
        bit={bit}
        shownLimit={Infinity}
        itemProps={slackConvoBitContentStyle}
      >
        {({ permalink, location, title, icon, content }) => {
          return (
            <>
              <PeekHeader
                if={bit}
                title={title}
                subtitle={location}
                after={
                  <after>
                    <permalink>{permalink}</permalink>
                    <space />
                    <OrbitIcon if={icon} icon={icon} size={16} />
                  </after>
                }
              />
              <main>
                <mainInner>
                  <content>
                    <UI.Text selectable css={{ margin: [5, 0, 20] }} size={1.2}>
                      In this conversation <strong>Nick</strong>,{' '}
                      <strong>Nate</strong>, and 4 other people discussed a16z
                      partners, orbit domain, mock-up, Formidable and refactor.
                    </UI.Text>
                    {content}
                  </content>
                  <OrbitDivider />
                  <section>
                    <SubTitle>Related</SubTitle>
                    <carouselInner>
                      <Carousel items={store.related} />
                    </carouselInner>
                  </section>
                  <OrbitDivider />
                  <section>
                    <SubTitle>Recent and Related Conversations</SubTitle>
                    <br />
                    {store.relatedConversations.map((relatedBit, index) => (
                      <React.Fragment key={`${relatedBit.id}${index}`}>
                        <BitContent
                          appStore={appStore}
                          bit={relatedBit}
                          shownLimit={Infinity}
                          itemProps={slackConvoBitContentStyle}
                        >
                          {({ content }) => content}
                        </BitContent>
                        <OrbitDivider
                          if={index < 2}
                          height={2}
                          css={{ margin: [20, 0, 10] }}
                        />
                      </React.Fragment>
                    ))}
                    <br />
                    <br />
                    <br />
                  </section>
                </mainInner>
              </main>
            </>
          )
        }}
      </BitContent>
    )
  }

  static style = {
    main: {
      flex: 1,
      overflowY: 'scroll',
      margin: 10,
    },
    mainInner: {
      margin: [0, -10, -5],
    },
    content: {
      padding: [10, 20],
    },
    section: {
      padding: [10, 20, 0],
    },
    carouselInner: {
      margin: [0, -10, 10, -30],
    },
    after: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    space: {
      width: 7,
    },
    permalink: {
      opacity: 0.5,
    },
  }
}
