import * as React from 'react'
import { view } from '@mcro/black'
import marked from 'marked'
import emojinize from 'emojinize'
import * as UI from '@mcro/ui'
import App from '~/app'

const format = str => {
  return marked(emojinize.encode(str))
}

const parseMessage = text => {
  const split = text.split('[]')
  const first = split[0]
  const who = text.split(' ')[0]
  const date = first.split(' ')[1]
  const body = text.slice(first.length + 4)

  return { date, who, body }
}

@view({
  store: class CommitStore {
    info = App.services.Github.github
      .repos('motion', 'orbit')
      .commits(this.props.sha)
      .fetch()
  },
})
class Commit {
  render({ store }) {
    return (
      <commit if={store.info}>
        {store.info.files.map(file => file.patch)}
      </commit>
    )
  }
}

@view
export default class FeedItem {
  getBody(event, { payload }, store) {
    switch (event.type) {
      case 'convo':
        const { data: { messages }, authors } = event
        const avatar = s => `/images/${s === 'nate' ? 'me' : s}.jpg`

        return (
          <convo>
            <info $$row>
              <UI.Title size={1.2}>
                {UI.Date.format(event.data.createdAt)}
              </UI.Title>
              {authors.map(author => (
                <UI.Button
                  chromeless
                  css={{ marginLeft: 10 }}
                  icon={
                    <img
                      $avatar
                      css={{ marginRight: -3 }}
                      src={avatar(author)}
                    />
                  }
                  onMouseDown={() => {
                    store.togglePerson(author)
                  }}
                >
                  {author}
                </UI.Button>
              ))}
            </info>
            <texts>
              {messages.map((message, index) => {
                const { date, who, body } = parseMessage(message)
                const lastWho =
                  index === 0 ? null : parseMessage(messages[index - 1]).who

                return (
                  <item css={{ marginTop: 5 }}>
                    <user if={lastWho !== who} $$row>
                      <UI.Button
                        icon={
                          <img
                            css={{ marginRight: -3 }}
                            src={avatar(who)}
                            $avatar
                          />
                        }
                        onMouseDown={() => store.togglePerson(who)}
                        chromeless
                        $$row
                        css={{
                          marginBottom: 10,
                          fontWeight: 600,
                          marginRight: 10,
                        }}
                      >
                        {who}
                      </UI.Button>
                      <date css={{ opacity: 0.7, marginTop: 5 }}>{date}</date>
                    </user>
                    <message css={{ marginLeft: 5, marginTop: -3 }}>
                      {body}
                    </message>
                  </item>
                )
              })}
            </texts>
          </convo>
        )

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
              <UI.Button
                chromeless
                css={{ marginLeft: 10 }}
                icon={
                  <img
                    $avatar
                    css={{ marginRight: -3 }}
                    src={author.avatarUrl}
                  />
                }
                onMouseDown={() => {
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
            <body $$row>
              <main css={{ flex: 1 }}>
                {payload.commits.map(commit => (
                  <commit key={commit.sha}>
                    <UI.Text html={format(commit.message)} />
                  </commit>
                ))}
              </main>

              <cards css={{ width: 200 }}>
                <header
                  css={{
                    flexFlow: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: 10,
                  }}
                >
                  <nav css={{ flexFlow: 'row' }}>
                    <UI.Icon name="arrowminleft" color="white" />
                    <UI.Icon name="arrowminright" color="white" />
                  </nav>
                </header>
                <UI.Surface
                  color="black"
                  background="#fff"
                  flex={1}
                  borderRadius={5}
                >
                  <Commit sha={payload.commits[0].sha} />
                </UI.Surface>
              </cards>
            </body>
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

  extraInfo(event) {
    const { data } = event
    const { payload } = data
    switch (event.type) {
      case 'DeleteEvent':
        return (
          <UI.Text>
            branch <strong>
              {payload.ref.replace('refs/heads/', '')}
            </strong>{' '}
          </UI.Text>
        )
      case 'PushEvent':
        return (
          <UI.Text>
            {payload.commits.length} commits to branch{' '}
            <strong>{payload.ref.replace('refs/heads/', '')}</strong>{' '}
          </UI.Text>
        )
    }
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
          {this.extraInfo(event)}
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
