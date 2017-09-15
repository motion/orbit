import * as React from 'react'
import { view } from '@mcro/black'
import emojinize from 'emojinize'
import * as UI from '@mcro/ui'
import Card from './card'

@view
export default class FeedItem {
  getBody(event, { payload }) {
    switch (event.type) {
      case 'PushEvent':
        return (
          <body if={payload.commits}>
            <Card title="Commits">
              {payload.commits.map(commit => (
                <commit key={commit.sha}>
                  <UI.Text>{emojinize.encode(commit.message)}</UI.Text>
                </commit>
              ))}
            </Card>
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

  render({ event }) {
    const { verb, data } = event
    if (!data) {
      console.log('no data')
      return null
    }

    const { actor } = data
    const body = this.getBody(event, data)

    return (
      <feeditem>
        <info if={actor}>
          <avatar $img={actor.avatar_url} />
          <UI.Text $name>{actor.login} </UI.Text>
          <UI.Text $action>{verb} </UI.Text>
          <UI.Date $date>{event.updated || event.created}</UI.Date>
        </info>
        {body}
      </feeditem>
    )
  }

  static style = {
    feeditem: {
      width: '100%',
      justifyContent: 'center',
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
  }
}
