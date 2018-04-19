import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
import bitContents from '~/components/bitContents'
import OrbitIcon from '~/apps/orbit/orbitIcon'

@view
export class Conversation {
  render({ bit, selectedItem, appStore }) {
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
                date={bit.createdAt}
                after={
                  <after $$row>
                    {permalink}
                    <OrbitIcon if={icon} icon={icon} size={16} />
                  </after>
                }
              />
              <content>{content}</content>
            </React.Fragment>
          )
        }}
      </BitContent>
    )
  }

  static style = {
    content: {
      flex: 1,
      padding: [10, 20],
      overflowY: 'scroll',
    },
  }
}
