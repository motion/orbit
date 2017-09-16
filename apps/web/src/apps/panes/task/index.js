import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '../pane'
import * as React from 'react'
import ColorBlock from './colorBlock'
import Comment from './comment'
import TaskStore from './store'
import { LabelAction, AssignAction } from './actions'

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
          onKeyDown={e => {
            if (e.keyCode === 13 && e.metaKey) onSubmit(store.response)
          }}
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

@view.attach('millerStore')
@view
class TaskHeader {
  render({
    millerStore,
    data: { title },
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
                millerStore.runAction('labels')
              }}
              className="target-labels"
              $button
            >
              {labelsText}
            </UI.Button>
            <UI.Button
              onClick={() => {
                millerStore.runAction('assign')
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

const typeToElement = type =>
  ({
    comment: Comment,
    header: TaskHeader,
    response: AddResponse,
  }[type] || <h3>{type} not found</h3>)

@view({
  store: TaskStore,
})
export default class TaskPane {
  renderItem = index => {
    const { paneStore: { activeIndex }, store } = this.props
    const { elName, data } = store.results[index]
    const El = typeToElement(elName)

    return (
      <El
        data={data}
        store={store}
        key={index}
        isActive={index === activeIndex}
      />
    )
  }

  render({ paneStore: { isActive }, store }) {
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
      <Pane.Card isActive={isActive} actions={actions}>
        <container>
          <header>{this.renderItem(0)}</header>
          <content>
            {store.results
              .slice(1, -1)
              .map((result, index) => this.renderItem(index + 1))}
          </content>
          <footer>{this.renderItem(store.results.length - 1)}</footer>
        </container>
      </Pane.Card>
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
