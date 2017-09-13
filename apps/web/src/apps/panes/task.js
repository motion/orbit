import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from './pane'
import * as React from 'react'
import Multiselect from './views/multiselect'
import timeAgo from 'time-ago'
import { range } from 'lodash'

const { ago } = timeAgo()

const labelColors = {
  bug: 'red',
  duplicate: 'gray',
  'help wanted': 'green',
  question: 'purple',
  enhancement: 'blue',
}

@view
class ColorBlock {
  render({ id, size = 20 }) {
    return (
      <color
        style={{
          width: size,
          height: size,
          background: labelColors[id] || 'gray',
        }}
      />
    )
  }

  static style = {
    color: {
      borderRadius: 5,
    },
  }
}
@view
class Comment {
  render({ isActive, data: { body, createdAt, author } }) {
    /*
    const name = includes(author, ' ')
      ? author.split(' ')[0].toLowerCase()
      : author
    const image = name === 'nate' ? 'me' : name
    */
    const isOwner = CurrentUser.github.profile.username === author.login

    return (
      <comment $$row $isActive={isActive}>
        <user>
          <img $avatar src={author.avatarUrl} />
        </user>
        <content>
          <info $$row>
            <left $$row>
              <UI.Text $name>{author.login}</UI.Text>
              <UI.Text $when>{ago(new Date(createdAt))}</UI.Text>
            </left>
            <buttons $$row>
              <UI.Button if={isOwner} chromeless icon="edit" opacity={0.7} />
              <UI.Button if={isOwner} chromeless icon="remove" opacity={0.7} />
            </buttons>
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
    info: {
      justifyContent: 'space-between',
    },
    left: {
      marginTop: 3,
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
      padding: [3, 0],
      flex: 1,
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
  render({ store, isActive, data: { onSubmit } }) {
    const commentButtonActive = store.response.trim().length > 0

    return (
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
    )
  }

  static style = {
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      // justifyContent: 'flex-end',
    },
    isActive: {},
    info: {
      marginTop: 5,
      justifyContent: 'space-between',
    },
    buttons: {
      flex: 1,
      maxWidth: 190,
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

@view.attach('millerState')
@view
class TaskHeader {
  render({
    millerState,
    data,
    data: { title, author },
    store: { labels, assigned },
    isActive,
  }) {
    const minSize = 1.4
    const maxSize = 2.5
    const titleSize = 3 - title.length * 0.05
    let labelsText = labels.length + ' Labels'
    if (labels.length === 0) labelsText = 'No Labels'
    if (labels.length === 1) labelsText = 'One Label'

    return (
      <header $isActive={isActive}>
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
                millerState.runAction('labels')
              }}
              className="target-labels"
              $button
            >
              {labelsText}
            </UI.Button>
            <UI.Button
              onClick={() => {
                millerState.runAction('assign')
              }}
              className="target-assign"
              $button
            >
              Assign
            </UI.Button>
          </buttons>
        </meta>
        <titleContainer>
          <UI.Title size={Math.min(maxSize, Math.max(titleSize, minSize))}>
            {title}
          </UI.Title>
          <badges $$row>
            {labels.map(label => (
              <UI.Button
                chromeless
                icon={<ColorBlock size={16} id={label} />}
                iconSize={12}
                $badge
              >
                {label}
              </UI.Button>
            ))}
            {assigned.map(id => (
              <UI.Button chromeless iconSize={12} $badge>
                {id}
              </UI.Button>
            ))}
          </badges>
        </titleContainer>
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
    badges: {
      height: 10,
      marginTop: 5,
    },
    badge: {
      marginLeft: 6,
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
  render({ onClose, onChange, store }) {
    return (
      <UI.Theme name="light">
        <multi>
          <Multiselect
            items={store.assignOptions}
            onClose={onClose}
            activeIds={store.assigned}
            onChange={onChange}
            renderItem={(item, { index, isActive, isHighlight }) => (
              <SelectItem
                key={item.id}
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
  render({ key, icon, isActive, index, isHighlight, text }) {
    return (
      <UI.Theme name="light">
        <item
          key={key}
          $first={index === 0}
          $isActive={isActive}
          $isHighlight={isHighlight}
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
      opacity: 0.7,
      background: '#f2f2f2',
    },
    isHighlight: {
      color: '#000',
      opacity: 0.9,

      background: '#eee',
    },
  }
}

@view
class Labels {
  render({ onChange, onClose, store, activeIds }) {
    return (
      <UI.Theme name="light">
        <multi>
          <Multiselect
            onClose={onClose}
            items={store.labelOptions}
            activeIds={activeIds}
            onChange={onChange}
            renderItem={(item, { index, isActive, isHighlight }) => (
              <SelectItem
                text={item.id}
                isActive={isActive}
                isHighlight={isHighlight}
                index={index}
                icon={<ColorBlock id={item.id} />}
              />
            )}
          />
        </multi>
      </UI.Theme>
    )
  }

  static style = {}
}

class TaskStore {
  response = ''
  count = 0

  labels = []
  assigned = []

  assignOptions = [{ id: 'me' }, { id: 'nick' }, { id: 'steph' }]

  labelOptions = [
    { id: 'bug' },
    { id: 'duplicate' },
    { id: 'enhancement' },
    { id: 'help wanted' },
    { id: 'invalid' },
    { id: 'question' },
    { id: 'wontfix' },
  ]

  setLabels = xs => {
    this.labels = xs
  }

  setAssigned = xs => {
    this.assigned = xs
  }

  start() {
    const { data: { data } } = this.props.paneStore

    this.props.getRef(this)

    this.labels = data.labels.map(({ name }) => name)
  }

  submit = () => {
    this.response = ''
  }

  get results() {
    const { data: { data } } = this.props.paneStore

    const comments = (data.comments || []).map(comment => ({
      element: Comment,
      data: comment,
      actions: [],
    }))

    const firstComment = {
      element: Comment,
      data: {
        author: data.author,
        body: data.body,
        createdAt: data.createdAt,
      },
    }

    return [
      {
        element: TaskHeader,
        data,
        actions: [],
      },
      firstComment,
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
class LabelAction {
  render({ store, onClose }) {
    return (
      <Labels
        activeIds={store.labels}
        onClose={onClose}
        store={store}
        onChange={store.setLabels}
      />
    )
  }
}

@view
class AssignAction {
  render({ store, onClose }) {
    return (
      <Assign
        activeIds={store.assigned}
        onClose={onClose}
        store={store}
        onChange={store.setAssigned}
      />
    )
  }
}

@view({
  store: TaskStore,
})
export default class TaskPane {
  render({ paneStore: { activeIndex, isActive }, store }) {
    const renderItem = index => {
      const { element, data } = store.results[index]
      const El = element
      return (
        <El
          data={data}
          store={store}
          key={index}
          isActive={index === activeIndex}
        />
      )
    }

    const actions = [
      {
        name: 'labels',
        popover: props => <LabelAction store={store} {...props} />,
      },
      {
        name: 'assign',
        popover: props => <AssignAction store={store} {...props} />,
      },
    ]

    return (
      <UI.Theme name="clear-dark">
        <Pane.Card isActive={isActive} actions={actions}>
          <container>
            <header>{renderItem(0)}</header>
            <content>
              {store.results
                .slice(1)
                .slice(0, -1)
                .map((result, index) => renderItem(index + 1))}
            </content>
            <footer>{renderItem(store.results.length - 1)}</footer>
          </container>
        </Pane.Card>
      </UI.Theme>
    )
  }

  static style = {
    container: {
      padding: 20,
      flex: 1,
      justifyContent: 'space-between',
    },
    header: {},
    content: {
      flex: 1,
      overflow: 'scroll',
    },
    footer: {},
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
  }
}
