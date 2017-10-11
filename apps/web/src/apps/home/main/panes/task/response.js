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
  render({ taskStore }) {
    const { data: { onSubmit } } = taskStore
    const commentButtonActive = taskStore.response.trim().length > 0

    return (
      <container>
        <textarea
          value={taskStore.response}
          onChange={e => (taskStore.response = e.target.value)}
          onKeyDown={e => {
            if (e.keyCode === 13 && e.metaKey) onSubmit(taskStore.response)
          }}
          placeholder="Leave a comment"
          className="dark-textarea"
          ref={taskStore.ref('textbox').set}
        />
        <info $$row>
          <UI.Text $shortcut $bright={commentButtonActive}>
            cmd+enter to post
          </UI.Text>
          <UI.Row spaced>
            <UI.Button size={0.9}>Archive</UI.Button>
            <UI.Button
              size={0.9}
              disabled={!commentButtonActive}
              onClick={() => onSubmit(taskStore.response)}
              icon="send"
            >
              Comment
            </UI.Button>
          </UI.Row>
        </info>
      </container>
    )
  }

  static style = {
    container: {
      borderTop: [1, [0, 0, 0, 0.1]],
      minHeight: 140,
      padding: [10, 25],
      margin: [0, -15],
    },
    info: {
      margin: [5, 0, 0],
      justifyContent: 'space-between',
    },
    buttons: {
      maxWidth: 190,
      justifyContent: 'space-between',
    },
    shortcut: {
      flex: 2,
      alignSelf: 'center',
      opacity: 0.4,
    },
    bright: {
      opacity: 1,
    },
    textarea: {
      margin: [5, -10],
      padding: 10,
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.2)',
      width: '100%',
      height: 80,
      borderRadius: 3,
      fontSize: 14,
    },
  }
}
