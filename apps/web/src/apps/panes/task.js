import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from './pane'
import * as React from 'react'
import Multiselect from './views/multiselect'
import timeAgo from 'time-ago'
import { capitalize } from 'lodash'

const { ago } = timeAgo()

@view
class Comment {
  render({ isActive, data: { body, createdAt, author } }) {
    /*
    const name = includes(author, ' ')
      ? author.split(' ')[0].toLowerCase()
      : author
    const image = name === 'nate' ? 'me' : name
    */

    return (
      <comment if={author} $isActive={isActive} $$row>
        <user>
          <img $avatar src={author.avatarUrl} />
        </user>
        <content>
          <info $$row>
            <name>
              {author.login}
            </name>
            <when>
              {ago(new Date(createdAt))}
            </when>
          </info>

          <p>
            {body}
          </p>
        </content>
      </comment>
    )
  }

  static style = {
    isActive: {
      background: '#aaa',
    },
    comment: {
      flex: 1,
      padding: [7, 5],
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
    when: {
      marginLeft: 5,
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
    textbox = null
    response = ''
  },
})
class AddResponse {
  componentWillReceiveProps({ isActive, store }) {
    if (isActive && !this.props.isActive) store.textbox.focus()
    if (!isActive && this.props.isActive) store.textbox.blur()
  }

  render({ store, isActive, data: { onSubmit } }) {
    const commentButtonActive = store.response.trim().length > 0

    return (
      <comment $isActive={isActive}>
        <textarea
          $response
          value={store.response}
          onChange={e => (store.response = e.target.value)}
          placeholder="Leave a comment"
          ref={store.ref('textbox').set}
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
  render({ data, data: { title, author, createdAt, body }, isActive }) {
    console.log('created at ', data.createdAt)
    return (
      <header $isActive={isActive}>
        <UI.Title size={2}>
          {title}
        </UI.Title>
        <meta $$row>
          <UI.Button chromeless>No Labels</UI.Button>
          <UI.Button chromeless>No one Assigned</UI.Button>
        </meta>
        <info $$row>
          <img $avatar src={author.avatarUrl} />
          <name>
            {author.login}
          </name>
          <when>
            {ago(new Date(createdAt))}
          </when>
        </info>
        <p>
          {body}
        </p>
      </header>
    )
  }

  static style = {
    header: {
      marginBottom: 20,
    },
    isActive: {
      background: '#999',
    },
    info: {
      alignItems: 'center',
      marginTop: 5,
    },
    name: {
      fontWeight: 500,
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 10,
    },
    when: {
      marginLeft: 10,
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

    const comments = (data.comments || []).map(comment => ({
      element: Comment,
      data: comment,
      actions: ['like comment'],
    }))

    return [
      {
        element: TaskHeader,
        data,
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

@view
class Assign {
  render() {
    return (
      <multi>
        <Multiselect
          items={[{ id: 'me' }, { id: 'nick' }, { id: 'steph' }]}
          renderItem={(item, { index, isActive, isHighlight }) =>
            <SelectItem
              text={item.id}
              isActive={isActive}
              isHighlight={isHighlight}
              index={index}
              icon={<img src={`/images/${item.id}.jpg`} $avatar />}
            />}
        />
      </multi>
    )
  }

  static style = {
    avatar: {
      borderRadius: 100,
      width: 24,
      height: 24,
    },
  }
}

@view
class SelectItem {
  render({ icon, isActive, index, isHighlight, text }) {
    return (
      <item
        $first={index === 0}
        $isHighlight={isHighlight}
        $isActive={isActive}
        $$row
      >
        <left $$row>
          <check>
            {isActive && <UI.Icon size={14} $icon name="check" />}
          </check>
          {icon}
          <name>
            {text}
          </name>
        </left>
        <x>
          {isActive && <UI.Icon size={14} $icon name="remove" />}
        </x>
      </item>
    )
  }
  static style = {
    item: {
      width: '100%',
      borderTop: '1px solid #e8e8e8',
      padding: [12, 20],
      flex: 1,
      alignItems: 'center',
      fontWeight: 600,
      justifyContent: 'space-between',
      fontSize: 16,
    },
    left: {
      alignItems: 'center',
    },
    check: {
      width: 30,
    },
    icon: {
      opacity: 0.6,
    },
    x: {
      width: 30,
      marginLeft: 30,
    },
    first: {
      //borderTop: '0px solid white',
    },
    name: {
      marginLeft: 10,
    },
    isActive: {
      opacity: 0.9,
      background: '#f2f2f2',
    },
    isHighlight: {
      background: '#eee',
    },
  }
}

@view
class Labels {
  render() {
    const labelColors = {
      bug: 'red',
      duplicate: 'gray',
      'help wanted': 'green',
      question: 'purple',
      enhancement: 'blue',
    }
    return (
      <multi>
        <Multiselect
          items={[
            { id: 'bug' },
            { id: 'duplicate' },
            { id: 'enhancement' },
            { id: 'help wanted' },
            { id: 'invalid' },
            { id: 'question' },
            { id: 'wontfix' },
          ]}
          renderItem={(item, { index, isActive, isHighlight }) =>
            <SelectItem
              text={item.id}
              isActive={isActive}
              isHighlight={isHighlight}
              index={index}
              icon={
                <color style={{ background: labelColors[item.id] || 'gray' }} />
              }
            />}
        />
      </multi>
    )
  }

  static style = {
    color: {
      borderRadius: 5,
      width: 20,
      height: 20,
    },
  }
}

@view.provide({ paneStore: Pane.Store })
@view({
  store: TaskStore,
})
export default class TaskPane {
  render({ data, activeIndex, isActive, store }) {
    const { labels } = data
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
          actions={['Assign', 'Milestone', 'Labels']}
        >
          <container>
            <info $$row if={false}>
              <UI.Popover
                distance={14}
                openOnClick
                target={<UI.Button>labels</UI.Button>}
              >
                <Labels />
              </UI.Popover>
              <UI.Popover
                openOnClick
                distance={14}
                target={<UI.Button>assign</UI.Button>}
              >
                <Assign />
              </UI.Popover>
            </info>
            {renderItem(0)}
            <commentTitle>
              <UI.Title size={1}>
                {data.comments.length} Comments
              </UI.Title>
            </commentTitle>
            {store.results
              .slice(1)
              .map((result, index) => renderItem(index + 1))}
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
    commentTitle: {
      padding: [10, 0],
      borderTop: [1, [0, 0, 0, 0.05]],
      borderBottom: [1, [0, 0, 0, 0.05]],
      marginBottom: 10,
    },
    info: {
      justifyContent: 'space-between',
      width: 300,
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
