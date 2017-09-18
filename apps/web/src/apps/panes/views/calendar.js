// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Calendar extends React.Component<> {
  static defaultProps: {}
  render() {
    return (
      <calendar>
        <content css={{ overflowY: 'scroll' }}>
          {[
            {
              month: '12',
              day: '7',
              time: '7am',
              description: 'IdeaDrive w/Search team',
            },
            {
              month: '12',
              day: '7',
              time: '10am',
              description: 'OKR Review w/James',
            },
            {
              month: '12',
              day: '7',
              time: '3pm',
              description: 'Planetary fundraiser',
            },
            {
              month: '12',
              day: '8',
              time: '8am',
              description: 'Q4 linkup review',
            },
            {
              month: '12',
              day: '8',
              time: '10:30am',
              description: '1on1 with Dave',
            },
          ].map(
            (item, index) =>
              item.content || (
                <item
                  if={!item.content}
                  key={index}
                  css={{
                    padding: [5, 12, 5, 12],
                  }}
                >
                  <div
                    $date
                    css={{
                      flexFlow: 'row',
                    }}
                  >
                    <div
                      $time
                      css={{
                        opacity: 0.5,
                      }}
                    >
                      <UI.Text size={1}>{item.time}</UI.Text>
                    </div>
                  </div>
                  <div
                    $description
                    css={{
                      marginTop: 5,
                      fontWeight: 400,
                    }}
                  >
                    <UI.Text size={1.1}>{item.description}</UI.Text>
                  </div>
                </item>
              )
          )}
        </content>
      </calendar>
    )
  }

  static style = {
    section: {
      padding: [8, 10],
    },
  }
}
