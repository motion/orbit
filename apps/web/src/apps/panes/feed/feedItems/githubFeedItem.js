import * as React from 'react'
import { view } from '@mcro/black'
import { format } from '~/apps/panes/task/helpers'
import * as UI from '@mcro/ui'
import GithubCommit from './githubCommit'
import Task from '~/apps/panes/task'

@view
export default class GithubFeedItem {
  getBody(event) {
    const { payload } = event.data
    switch (event.type) {
      case 'IssuesEvent':
        return <Task paneStore={{ activeIndex: 1, data: event.data }} />
      case 'PushEvent':
        return (
          <content if={payload.commits}>
            <main>
              {payload.commits.map(commit => (
                <commit key={commit.sha}>
                  <UI.Text html={format(commit.message)} />
                </commit>
              ))}
            </main>
            <cards
              css={{
                height: 100,
                overflow: 'hidden',
                justifyContent: 'flex-start',
              }}
            >
              <header
                css={{
                  flexFlow: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 10,
                }}
              >
                <nav if={false} css={{ flexFlow: 'row' }}>
                  <UI.Icon name="arrowminleft" color="white" />
                  <UI.Icon name="arrowminright" color="white" />
                </nav>
              </header>
              <UI.Surface
                color="black"
                background="#fff"
                flex={1}
                borderRadius={5}
                padding={15}
              >
                <GithubCommit sha={payload.commits[0].sha} />
              </UI.Surface>
            </cards>
          </content>
        )
      case 'IssueCommentEvent':
        return (
          <content if={payload.comment}>
            <UI.Text html={format(payload.comment.body)} />
          </content>
        )
    }
    return null
  }

  extraInfo(event) {
    const { data } = event
    const { payload } = data
    const branch = payload.ref ? payload.ref.replace('refs/heads/', '') : ''
    switch (event.type) {
      case 'DeleteEvent':
        return (
          <UI.Text>
            branch <strong>{branch}</strong>{' '}
          </UI.Text>
        )
      case 'PushEvent':
        return (
          <UI.Text>
            {payload.commits.length} commits to branch{' '}
            <strong>
              <a href={`https://github.com/${data.repo.name}/tree/${branch}`}>
                {branch}
              </a>
            </strong>{' '}
          </UI.Text>
        )
    }
  }

  render({ children, event }) {
    const body = this.getBody(event)
    const extraInfo = this.extraInfo(event)
    if (typeof children === 'function') {
      return children({
        body,
        extraInfo,
      })
    }
    return body
  }

  static style = {
    content: {
      flex: 1,
      padding: [0, 20],
    },
  }
}
