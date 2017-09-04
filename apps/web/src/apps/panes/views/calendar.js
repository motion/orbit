// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Calendar extends React.Component<> {
  static defaultProps: {};
  render() {
    return (
      <calendar>
        <UI.Title>Calender</UI.Title>
        <content
          $$row
          css={{ width: '100%', overflowX: 'scroll', margin: [-5, 0] }}
        >
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
                    width: '16.6666%',
                    minWidth: 110,
                    padding: [10, 25, 10, 0],
                    color: '#fff',
                  }}
                >
                  <date
                    css={{
                      opacity: 1,
                      flexFlow: 'row',
                    }}
                  >
                    <time
                      css={{
                        fontSize: 16,
                        opacity: 0.5,
                        fontWeight: 300,
                        marginLeft: 0,
                      }}
                    >
                      {item.time}
                    </time>
                  </date>
                  <description
                    css={{
                      fontSize: 14,
                      lineHeight: '17px',
                      marginTop: 10,
                      fontWeight: 400,
                    }}
                  >
                    {item.description}
                  </description>
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
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
  }
}
