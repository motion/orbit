import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { User } from '~/app'
import ReplyTitle from './replyTitle'

@view({
  store: class ReplyStore {
    editing = false
    docStore = null

    save = () => {
      this.docStore.save()
      this.editing = false
    }
  },
})
export default class Reply {
  render({ store, doc, embed }) {
    return (
      <message $embed={embed}>
        <ReplyTitle doc={doc} />
        <doc>
          <DocumentView
            if={!embed}
            readOnly={!store.editing}
            focus={store.editing}
            noTitle
            document={doc}
            getRef={view => (store.docStore = view.docStore)}
            manualSave
          />
        </doc>
        <meta>
          <metacontents>
            <UI.Text size={0.9} color="#999" />
            <actions>
              <UI.Text
                if={!store.editing && User.id === doc.authorId}
                onClick={store.ref('editing').toggle}
              >
                Edit
              </UI.Text>

              <UI.Row spaced itemProps={{ glow: false }} if={store.editing}>
                <UI.Button
                  chromeless
                  onClick={store.ref('editing').toggle}
                  opacity={0.4}
                >
                  Delete
                </UI.Button>
                <UI.Button chromeless onClick={store.ref('editing').toggle}>
                  Cancel
                </UI.Button>
                <UI.Button onClick={store.save}>Save</UI.Button>
              </UI.Row>
            </actions>
          </metacontents>
        </meta>
      </message>
    )
  }

  static style = {
    message: {
      padding: [20, 25],
      // flexFlow: 'row',
      alignItems: 'stretch',
      position: 'relative',
    },
    meta: {
      width: '100%',
    },
    metacontents: {
      flex: 1,
      justifyContent: 'space-between',
      flexFlow: 'row',
    },
    user: {
      flexFlow: 'row',
    },
    // leaves room for left bar
    doc: {
      marginLeft: -28,
      padding: [20, 0],
      flex: 1,
    },
    fake: {
      color: '#333',
      padding: [5, 20],
      lineHeight: 1.2,
    },
    actions: {
      justifyContent: 'space-between',
      flexFlow: 'row',
    },
  }
}
