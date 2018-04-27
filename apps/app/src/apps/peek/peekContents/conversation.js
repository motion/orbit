import * as React from 'react'
// import * as UI from '@mcro/ui'
import { view, react } from '@mcro/black'
import PeekHeader from '../peekHeader'
import bitContents from '~/components/bitContents'
import OrbitIcon from '~/apps/orbit/orbitIcon'
import Carousel from '~/components/carousel'
import { SubTitle } from '~/views'
import OrbitDivider from '~/apps/orbit/orbitDivider'
import { Bit, Person } from '@mcro/models'

class ConversationPeek {
  @react({ fireImmediately: true, defaultValue: [] })
  related = [
    () => 0,
    async () => {
      const people = await Person.find({ take: 3, skip: 7 })
      const bits = await Bit.find({ take: 3, relations: ['people'] })
      return [...people, ...bits]
    },
  ]
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
        result={bit}
        shownLimit={Infinity}
        itemProps={{
          contentStyle: {
            paddingLeft: 17,
          },
        }}
      >
        {({ permalink, location, title, icon, content }) => {
          return (
            <React.Fragment>
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
                  <content>{content}</content>
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
                    {appStore.summaryResults.slice(0, 3).map((item, index) => (
                      <React.Fragment key={`${item.id}${index}`}>
                        <BitContent
                          appStore={appStore}
                          result={item}
                          shownLimit={Infinity}
                          itemProps={{
                            contentStyle: {
                              paddingLeft: 17,
                            },
                          }}
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
            </React.Fragment>
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
