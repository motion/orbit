// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

type Props = { data: Object, activeIndex: number, items: Array<Object> }

@view
export default class Feed extends React.Component<Props> {
  render({ items, data, activeIndex }: Props) {
    return (
      <feed $inApp={data.special}>
        <UI.Title>Recently</UI.Title>
        <unpad>
          {items.map((event, index) => {
            const { verb, data } = event
            const { actor, payload } = data
            return (
              <feeditem
                $active={activeIndex === index}
                key={`${event.id}${index}`}
              >
                <meta if={actor}>
                  <avatar $img={actor.avatar_url} />
                  <UI.Text $name>{actor.login} </UI.Text>
                  <UI.Text $action>{verb} </UI.Text>
                  <UI.Date $date>{data.created_at}</UI.Date>
                </meta>
                <body if={payload && payload.commits}>
                  <content>
                    {payload.commits.map(commit => (
                      <UI.Text key={commit.sha}>{commit.message}</UI.Text>
                    ))}
                  </content>
                  <icon>
                    <UI.Icon name={event.integration} />
                  </icon>
                </body>
              </feeditem>
            )
          })}
        </unpad>
      </feed>
    )
  }

  static style = {
    feeditem: {
      padding: [10, 25],
      margin: [0, -5],
      color: '#fff',
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    meta: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      whiteSpace: 'pre',
      fontSize: 13,
      marginBottom: 5,
    },
    name: {
      fontWeight: 500,
    },
    action: {
      opacity: 0.5,
    },
    date: {
      opacity: 0.5,
    },
    body: {
      flexFlow: 'row',
    },
    content: {
      flex: 1,
      padding: [2, 5],
    },
    img: src => ({
      background: `url(${src})`,
      backgroundSize: 'cover',
    }),

    active: {
      background: [0, 0, 0, 0.05],
    },
    icon: {
      width: 30,
      height: 30,
      margin: [10, 5, 0],
      position: 'relative',
    },
    avatar: {
      width: 18,
      height: 18,
      borderRadius: 100,
      marginRight: 8,
    },
    inApp: {
      padding: [10, 15],
      background: '#f2f2f2',
    },
    unpad: {
      margin: [0, -15],
    },
  }
}
