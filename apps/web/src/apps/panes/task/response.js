import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as React from 'react'

@view({
  store: class ResponseStore {
    textbox = null
    response = ''
  },
})
export default class TaskResponse {
  render({ store, isActive, data: { onSubmit } }) {
    const commentButtonActive = store.response.trim().length > 0

    return (
      <container $isActive={isActive}>
        <textarea
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
      padding: [0, 10],
    },
    isActive: {},
    info: {
      margin: [5, 0],
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
    bright: {
      opacity: 1,
    },
    textarea: {
      margin: [5, 0],
      background: 'transparent',
      color: '#eee',
      border: '1px solid rgba(255,255,255,0.2)',
      width: '100%',
      height: 80,
      borderRadius: 3,
      padding: 10,
      fontSize: 14,
    },
  }
}
