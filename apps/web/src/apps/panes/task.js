import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from './pane'
import * as React from 'react'
import { includes } from 'lodash'
import PersonPicker from './views/personPicker'
import timeAgo from 'time-ago'

const { ago } = timeAgo()

@view
class Comment {
  render({ isActive, data: { body, author } }) {
    /*
    const name = includes(author, ' ')
      ? author.split(' ')[0].toLowerCase()
      : author
    const image = name === 'nate' ? 'me' : name
    */

    return (
      <comment $$row>
        <user>
          <img $avatar src="/images/me.jpg" />
        </user>
        <content>
          <name>Nate Weinert</name>
          <p>
            {body}
          </p>
        </content>
      </comment>
    )
  }

  static style = {
    comment: {
      flex: 1,
      padding: [7, 5],
      borderTop: '1px solid #eee',
    },
    isActive: {
      background: '#aaa',
    },
    avatar: {
      alignSelf: 'center',
      width: 40,
      height: 40,
      borderRadius: 100,
      marginRight: 10,
    },
    content: {
      flex: 1,
    },
    name: {
      fontWeight: 500,
    },
  }
}

@view({
  store: class {
    who = null
  },
})
class MetaItem {
  render({ store, label, value }) {
    return (
      <item key={label}>
        <PersonPicker
          if={false}
          popoverProps={{
            target: <UI.Button>assign</UI.Button>,
          }}
          onSelect={person => {
            store.who = person
          }}
        />
        <name>
          {label}
        </name>
        <value>
          {store.who ? store.who : value}
        </value>
      </item>
    )
  }

  static style = {}
}

@view({
  store: class ResponseStore {
    response = ''
  },
})
class AddResponse {
  render({ store, isActive, data: { onSubmit } }) {
    const commentButtonActive = store.response.trim().length > 0

    return (
      <comment $isActive={isActive}>
        <textarea
          $response
          value={store.response}
          onChange={e => (store.response = e.target.value)}
          placeholder="Leave a comment"
        />
        <info $$row>
          <shortcut $bright={commentButtonActive}>cmd+enter to post</shortcut>
          <buttons $$row>
            <UI.Button disabled={!commentButtonActive}>Archive</UI.Button>
            <UI.Button
              disabled={!commentButtonActive}
              onClick={() => onSubmit(store.response)}
              icon="send"
            >
              Comment
            </UI.Button>
          </buttons>
        </info>
      </comment>
    )
  }

  static style = {
    isActive: {
      background: '#aaa',
    },
    info: {
      marginTop: 5,
      justifyContent: 'space-between',
    },
    buttons: {
      flex: 1,
      justifyContent: 'space-between',
    },
    shortcut: {
      flex: 2,
      alignSelf: 'center',
      marginLeft: 5,
      opacity: 0.4,
    },
    comment: {},
    bright: {
      opacity: 0.7,
    },
    response: {
      marginTop: 5,
      background: '#fafbfc',
      border: '1px solid rgb(209, 213, 218)',
      width: '100%',
      height: 80,
      borderRadius: 5,
      padding: 10,
      fontSize: 14,
    },
  }
}

@view
class TaskHeader {
  render({ data: { title, body }, isActive }) {
    return (
      <header $isActive={isActive}>
        <h3>
          {title}
        </h3>
        <p>
          {body}
        </p>
      </header>
    )
  }

  static style = {
    isActive: {
      background: '#999',
    },
  }
}

class TaskStore {
  response = ''

  start() {
    this.props.getRef(this)
  }

  submit = () => {
    this.response = ''
  }

  get results() {
    const { data } = this.props

    const comments = data.comments.map(comment => ({
      element: Comment,
      data: comment,
      actions: ['like comment'],
    }))

    return [
      {
        element: TaskHeader,
        data: {
          title: data.title,
          body: data.body,
        },
        actions: ['imma header'],
      },
      ...comments,
      {
        element: AddResponse,
        data: {
          onSubmit(text) {
            console.log('submitted', text)
          },
        },
      },
    ]
  }
}

@view.provide({ paneStore: Pane.Store })
@view({
  store: TaskStore,
})
export default class TaskPane {
  render({ data, activeIndex, isActive, store }) {
    const { labels } = data
    const type = data.service || 'github'
    const items = [
      {
        label: 'Assignees',
        value: 'No one assigned',
      },
      {
        label: 'Labels',
        value: labels && labels.length > 0 ? labels : 'None yet',
      },
      {
        label: 'Milestone',
        value: 'No milestone',
      },
    ]

    const renderItem = index => {
      const { element, data } = store.results[index]
      return React.createElement(element, {
        data,
        key: index,
        isActive: index === activeIndex,
      })
    }

    return (
      <UI.Theme name="light">
        <Pane.Card
          isActive={isActive}
          actions={['one', 'two', 'three']}
          icon={type}
        >
          <container>
            {store.results.map((result, index) => renderItem(index))}
          </container>
        </Pane.Card>
      </UI.Theme>
    )
  }

  static style = {
    container: {
      padding: 20,
      flex: 1,
    },
    metaInfo: {
      justifyContent: 'space-between',
      borderBottom: [1, [0, 0, 0, 0.05]],
      padding: [5, 40],
    },
    headerActive: {
      background: '#aaa',
    },
    content: {
      flex: 1,
      overflow: 'scroll',
    },
  }
}
