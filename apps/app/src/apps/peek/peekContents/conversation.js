import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
import bitContents from '~/components/bitContents'
import OrbitIcon from '~/apps/orbit/orbitIcon'
import Carousel from '~/components/carousel'
import { SubTitle } from '~/views'
import OrbitDivider from '~/apps/orbit/orbitDivider'

@view
export class Conversation {
  render({ bit, appStore, showRelated }) {
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
                <content>{content}</content>
                <OrbitDivider />
                <section>
                  <SubTitle>Related</SubTitle>
                  <carouselInner>
                    <Carousel items={appStore.searchState.results} />
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
                      <OrbitDivider if={index < 2} />
                    </React.Fragment>
                  ))}
                  <br />
                  <br />
                </section>
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
    },
    content: {
      padding: [10, 20],
    },
    section: {
      padding: [20, 20, 0],
    },
    carouselInner: {
      margin: [0, -10, 0, -30],
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
