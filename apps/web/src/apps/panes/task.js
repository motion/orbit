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
            <UI.Text $name>{author.login}</UI.Text>
            <UI.Text $when>{ago(new Date(createdAt))}</UI.Text>
          </info>

          <UI.Text $body>{body}</UI.Text>
        </content>
      </comment>
    )
  }

  static style = {
    comment: {
      padding: 10,
      border: [1, [0, 0, 0, 0]],
      transition: 'all 150ms ease-in',
    },
    isActive: {
      border: [1, [0, 0, 0, 0.2]],
      boxShadow: '0px 0px 4px rgba(0,0,0,0.2)',
    },
    avatar: {
      alignSelf: 'center',
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 10,
    },
    content: {
      flex: 1,
    },
    when: {
      marginLeft: 5,
    },
    body: {
      padding: [5, 0],
      width: '95%',
    },
    name: {
      fontWeight: 500,
    },
  }
}

@view({
  store: class ResponseStore {
    textbox = null
    response = ''
  },
})
class AddResponse {
  componentWillReceiveProps({ isActive, store }) {
    // if (isActive && !this.props.isActive) store.textbox.focus()
    // if (!isActive && this.props.isActive) store.textbox.blur()
  }

  render({ store, isActive, data: { onSubmit } }) {
    const commentButtonActive = store.response.trim().length > 0

    return (
      <flex>
        <container $isActive={isActive}>
          <textarea
            $response
            value={store.response}
            onChange={e => (store.response = e.target.value)}
            placeholder="Leave a comment"
            className="dark-textarea"
            ref={store.ref('textbox').set}
          />
          <info $$row>
            <UI.Text $shortcut $bright={commentButtonActive}>
              cmd+enter to post
            </UI.Text>
            <buttons $$row>
              <UI.Button size={0.9}>Archive</UI.Button>
              <UI.Button
                size={0.9}
                disabled={!commentButtonActive}
                onClick={() => onSubmit(store.response)}
                icon="send"
              >
                Comment
              </UI.Button>
            </buttons>
          </info>
        </container>
      </flex>
    )
  }

  static style = {
    flex: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    isActive: {},
    info: {
      marginTop: 5,
      justifyContent: 'space-between',
    },
    buttons: {
      flex: 1,
      maxWidth: 170,
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
      opacity: 1,
    },
    response: {
      marginTop: 5,
      background: 'transparent',
      color: '#eee',
      border: '1px solid rgb(209, 213, 218)',
      width: '100%',
      height: 80,
      borderRadius: 5,
      padding: 10,
      fontSize: 14,
    },
  }
}

@view.attach('barStore')
@view
class TaskHeader {
  render({
    barStore,
    data,
    data: { title, author, createdAt, body },
    isActive,
  }) {
    const minSize = 1.4
    const maxSize = 2.5
    const titleSize = 3 - title.length * 0.05

    return (
      <header if={author} $isActive={isActive}>
        <meta $$row>
          <left $$row>
            <UI.Icon size={32} name="github" />
            <UI.Text opacity={0.7} size={1.2} $id>
              #323
            </UI.Text>
          </left>
          <buttons $$row>
            <UI.Button
              onClick={() => {
                barStore.runAction('labels')
              }}
              className="target-labels"
              $button
              size={0.8}
            >
              No Labels
            </UI.Button>
            <UI.Popover
              borderRadius={5}
              elevation={3}
              overlay="transparent"
              openOnClick
              distance={8}
              target={
                <UI.Button $button size={0.8}>
                  Nobody Assigned
                </UI.Button>
              }
            >
              <Assign />
            </UI.Popover>
            <UI.Popover
              if={false}
              borderRadius={5}
              elevation={3}
              overlay="transparent"
              openOnClick
              borderRadius
              distance={8}
              target={
                <UI.Button $button size={0.8}>
                  No Milestone
                </UI.Button>
              }
            >
              <Assign />
            </UI.Popover>
          </buttons>
        </meta>
        <titleContainer>
          <UI.Title size={Math.min(maxSize, Math.max(titleSize, minSize))}>
            {title}
          </UI.Title>
        </titleContainer>
        <firstComment>
          <Comment isActive={isActive} data={data} />
        </firstComment>
      </header>
    )
  }

  static style = {
    header: {
      marginBottom: 20,
    },
    titleContainer: {
      marginTop: 10,
      alignItems: 'center',
    },
    meta: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    id: {
      marginLeft: 10,
    },
    left: {
      flex: 6,
      alignItems: 'center',
    },
    buttons: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      margin: 5,
    },
    firstComment: {
      marginTop: 20,
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

@view
class Assign {
  render() {
    return (
      <UI.Theme name="light">
        <multi>
          <Multiselect
            items={[{ id: 'me' }, { id: 'nick' }, { id: 'steph' }]}
            renderItem={(item, { index, isActive, isHighlight }) => (
              <SelectItem
                text={item.id}
                isActive={isActive}
                isHighlight={isHighlight}
                index={index}
                icon={<img src={`/images/${item.id}.jpg`} $avatar />}
              />
            )}
          />
        </multi>
      </UI.Theme>
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
      <UI.Theme name="light">
        <item
          $first={index === 0}
          $isHighlight={isHighlight}
          $isActive={isActive}
          $$row
        >
          <left $$row>
            <check $activeIcon $opaque={isActive}>
              <UI.Icon color="#333" size={14} $icon name="check" />
            </check>
            {icon}
            <UI.Text $name>{text}</UI.Text>
          </left>
          <x $activeIcon $opaque={isActive}>
            <UI.Icon color="#333" size={14} $icon name="remove" />
          </x>
        </item>
      </UI.Theme>
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
      transition: 'background 80ms ease-in',
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
    activeIcon: {
      opacity: 0,
      transform: { scale: 0 },
      transformOrigin: '20% 50%',
      transition: 'all 80ms ease-in',
    },
    opaque: {
      opacity: 1,
      transform: { scale: 1 },
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
      <UI.Theme name="light">
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
            renderItem={(item, { index, isActive, isHighlight }) => (
              <SelectItem
                text={item.id}
                isActive={isActive}
                isHighlight={isHighlight}
                index={index}
                icon={
                  <color
                    style={{ background: labelColors[item.id] || 'gray' }}
                  />
                }
              />
            )}
          />
        </multi>
      </UI.Theme>
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
    data.title = 'Improve Babel performance of Acorn in 1.3'

    return [
      {
        element: TaskHeader,
        data,
        actions: [{ name: 'imma header' }],
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

@view({
  store: TaskStore,
})
export default class TaskPane {
  render({ paneStore: { activeIndex, isActive }, store }) {
    const renderItem = index => {
      const { element, data } = store.results[index]
      return React.createElement(element, {
        data,
        key: index,
        isActive: index === activeIndex,
      })
    }

    const actions = [
      {
        name: 'labels',
        popover: <Labels />,
      },
    ]

    return (
      <UI.Theme name="clear-dark">
        <Pane.Card isActive={isActive} actions={actions}>
          <container>
            {renderItem(0)}
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
