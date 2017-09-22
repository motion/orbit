import * as React from 'react'
import { view } from '@mcro/black'
import marked from 'marked'
import emojinize from 'emojinize'
import * as UI from '@mcro/ui'

const format = str => {
  return marked(emojinize.encode(str))
}

@view
export default class FeedItem {
  getBody(event, { payload }, store) {
    switch (event.type) {
      case 'task':
        const {
          title,
          number,
          labels,
          comments,
          body,
          createdAt,
          author,
        } = event.data
        return (
          <content>
            <top
              $$row
              css={{
                justifyContent: 'space-between',
              }}
            >
              <UI.Title size={1.2}>{title}</UI.Title>
              <extra
                $$row
                css={{
                  alignItems: 'center',
                }}
              >
                <labels css={{ marginRight: 5 }} $$row>
                  {labels.map(label => (
                    <UI.Badge
                      key={label.name}
                      color={label.name === 'ready' ? '#333' : 'white'}
                      background={'#' + label.color}
                    >
                      {label.name}
                    </UI.Badge>
                  ))}
                </labels>
                <UI.Button icon="holidays_message" chromeless>
                  {(comments || []).length + ''}
                </UI.Button>
              </extra>
            </top>
            <info $$row css={{ marginTop: -8 }}>
              <UI.Text>#{number}</UI.Text>
              <UI.Text> opened {UI.Date.format(createdAt)} by</UI.Text>
              <user
                css={{ marginLeft: 10 }}
                $$row
                onClick={() => store.toggleLogin(author.login)}
              >
                <img $avatar src={author.avatarUrl} />
                {author.login}
              </user>
              <UI.Button
                if={false}
                chromeless
                css={{ marginLeft: 10 }}
                icon={
                  <img
                    $avatar
                    css={{ marginRight: -3 }}
                    src={author.avatarUrl}
                  />
                }
                onClick={() => {
                  store.toggleLogin(author.login)
                }}
              >
                {author.login}
              </UI.Button>
            </info>
            <UI.Text opacity={0.7}>
              {body.length > 240 ? body.slice(0, 240) + '...' : body}
            </UI.Text>
          </content>
        )
      case 'PushEvent':
        return (
          <content if={payload.commits}>
            <header
              css={{
                flexFlow: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <left>
                <UI.Title if={payload.commits.length > 1} size={1.15}>
                  {payload.commits.length} commits
                </UI.Title>
              </left>
              <nav css={{ flexFlow: 'row' }}>
                <UI.Icon name="arrowminleft" color="white" />
                <UI.Icon name="arrowminright" color="white" />
              </nav>
            </header>

            {payload.commits.map(commit => (
              <commit key={commit.sha}>
                <UI.Text html={format(commit.message)} />
              </commit>
            ))}
          </content>
        )

      case 'IssueCommentEvent':
        return (
          <content if={payload.comment}>
            <content>
              <UI.Text html={format(payload.comment.body)} />
            </content>
          </content>
        )
    }

    return null
  }

  render({ store, event, style }) {
    const { verb, data } = event
    if (!data) {
      console.log('no data')
      return null
    }

    const { actor } = data
    const body = this.getBody(event, data, store)

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
      padding: [0, 20],
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
