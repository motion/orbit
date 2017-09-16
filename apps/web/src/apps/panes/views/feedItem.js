import * as React from 'react'
import { view } from '@mcro/black'
import marky from 'marky-markdown'
import * as UI from '@mcro/ui'
import Card from './card'

@view
export default class FeedItem {
  getBody(event, { payload }) {
    switch (event.type) {
      case 'PushEvent':
        return (
          <content if={payload.commits}>
            <Card icon={event.integration}>
              <header
                css={{
                  flexFlow: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <UI.Title>{payload.commits.length} commits</UI.Title>
                <nav css={{ flexFlow: 'row' }}>
                  <UI.Icon name="arrowminleft" color="#000" />
                  <UI.Icon name="arrowminright" color="#000" />
                </nav>
              </header>

              {payload.commits.map(commit => (
                <commit key={commit.sha}>
                  <UI.Text html={marky(commit.message)} />
                </commit>
              ))}
            </Card>
          </content>
        )

      case 'IssueCommentEvent':
        return (
          <content if={payload.comment}>
            <content>
              <UI.Text html={marky(payload.comment.body)} />
            </content>
          </content>
        )
    }

    return null
  }

  render({ event, style }) {
    const { verb, data } = event
    if (!data) {
      console.log('no data')
      return null
    }

    const { actor } = data
    const body = this.getBody(event, data)

    return (
      <feeditem style={style}>
        <info if={actor}>
          <avatar
            css={{
              background: `url(${actor.avatar_url})`,
              backgroundSize: 'cover',
            }}
          />
          <UI.Text $name>{actor.login} </UI.Text>
          <UI.Text $action>{verb} </UI.Text>
          <UI.Date $date>{event.updated || event.created}</UI.Date>
        </info>
        <body if={body}>{body}</body>
      </feeditem>
    )
  }

  static style = {
    feeditem: {
      width: '100%',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      padding: [0, 10],
    },
    info: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      whiteSpace: 'pre',
      fontSize: 13,
      height: 40,
    },
    body: {
      height: `calc(100% - 40px)`,
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
    content: {
      flex: 1,
      padding: 10,
    },
    avatar: {
      width: 18,
      height: 18,
      borderRadius: 100,
      marginRight: 8,
    },
    commit: {},
  }
}
