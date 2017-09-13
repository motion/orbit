// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Event } from '@mcro/models'
import emojinize from 'emojinize'

type Props = { data: Object, activeIndex: number, items: Array<Event> }

@view.ui
export default class Feed extends React.PureComponent<Props> {
  getBody(type: string, { payload }) {
    switch (type) {
      case 'PushEvent':
        return (
          <body if={payload.commits}>
            <content>
              {payload.commits.map(commit => (
                <UI.Text key={commit.sha}>
                  {emojinize.encode(commit.message)}
                </UI.Text>
              ))}
            </content>
            <icon>
              <UI.Icon name={event.integration} />
            </icon>
          </body>
        )

      case 'IssueCommentEvent':
        return (
          <body if={payload.comment}>
            <content>
              <UI.Text>{emojinize.encode(payload.comment.body)}</UI.Text>
            </content>
          </body>
        )
    }

    return null
  }

  render({ items, data, activeIndex }: Props) {
    return (
      <feed $inApp={data.special}>
        <UI.Title opacity={0.5} marginBottom={10}>
          Recently ({items.length})
        </UI.Title>
        <UI.List
          items={items}
          selected={activeIndex}
          getItem={(event, index) => {
            const { verb, data } = event
            if (!data) {
              console.log('no data')
              return null
            }

            const { actor } = data
            const body = this.getBody(event.type, data)

            return (
              <feeditem $active={index === activeIndex} key={index}>
                <info if={actor}>
                  <avatar $img={actor.avatar_url} />
                  <UI.Text $name>{actor.login} </UI.Text>
                  <UI.Text $action>{verb} </UI.Text>
                  <UI.Date $date>{event.updated || event.created}</UI.Date>
                </info>
                {body}
              </feeditem>
            )
          }}
        />
      </feed>
    )
  }

  static style = {
    feed: {
      flex: 1,
      position: 'relative',
    },
    info: {
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
      padding: 10,
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
    },
    unpad: {
      margin: [0, -15],
    },
  }
}
