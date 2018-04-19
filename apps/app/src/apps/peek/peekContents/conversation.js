import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
import bitContents from '~/components/bitContents'
import OrbitIcon from '~/apps/orbit/orbitIcon'
import Carousel from '~/components/carousel'

@view
export class Conversation {
  render({ bit, appStore }) {
    if (!bit) {
      return null
    }
    const BitContent = bitContents(bit)
    return (
      <BitContent
        appStore={appStore}
        result={bit}
        isExpanded
        shownLimit={Infinity}
      >
        {({ permalink, location, title, icon, content }) => {
          console.log({ permalink, location, title, icon, content })
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
                <carousel>
                  <UI.Title fontWeight={600}>Related</UI.Title>
                  <carouselInner>
                    <Carousel items={appStore.searchState.results} />
                  </carouselInner>
                </carousel>
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
    },
    content: {
      flex: 1,
      padding: [10, 20],
      overflowY: 'scroll',
    },
    carousel: {
      padding: [20, 20, 0],
    },
    carouselInner: {
      margin: [0, -25],
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
