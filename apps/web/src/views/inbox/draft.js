import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { random } from 'lodash'
import DocView from '~/views/document'

class ThreadDraftStore {
  doc = Document.threadDraft(this.threadId)

  get threadId() {
    return this.props.inboxStore.activeItem._id
  }

  create = () => {
    const { inboxStore } = this.props
    this.doc = Document.create({ draft: true, threadId: this.threadId })
  }

  send = () => {
    this.doc.draft = false
    this.doc.save()
  }
}

@view({
  store: ThreadDraftStore,
})
export default class Draft {
  render({ store }) {
    const { doc, creating } = store

    return (
      <draft>
        <top $$row>
          <UI.Title size={1}>
            <b>Nick</b>
          </UI.Title>
          <time>June 12</time>
        </top>
        <p if={!doc} $placeholder onClick={store.create}>
          Your Response
        </p>
        <DocView if={doc} id={doc._id} document={doc} />
        <actions $$row if={doc}>
          <status>
            <remind $$row>
              Remind me &nbsp;<b>in 2 days</b>&nbsp; if &nbsp;<b>no reply</b>&nbsp;
            </remind>
          </status>
          <buttons $$row>
            <UI.Button $discard chromeless>
              Discard
            </UI.Button>
            <UI.Button width={70} icon="send" chromeless onClick={store.send}>
              Send
            </UI.Button>
          </buttons>
        </actions>
      </draft>
    )
  }

  static style = {
    draft: {
      padding: [10, 18],
      border: '1px solid #ddd',
      borderRadius: 5,
      marginTop: 10,
      boxShadow: '0px 1px 0px #aaa',
    },
    name: {
      fontWeight: 'bold',
    },
    top: {
      justifyContent: 'space-between',
    },
    time: {
      opacity: 0.7,
      fontSize: 13,
    },
    status: {
      justifyContent: 'center',
      opacity: 0.7,
    },
    actions: {
      marginTop: 15,
      justifyContent: 'space-between',
    },
    buttons: {
      width: 150,
      justifyContent: 'space-between',
    },
    discard: {
      opacity: 0.6,
    },
    placeholder: {
      margin: [10, 5],
      color: '#333',
      border: '0px solid black',
      width: '100%',
      fontSize: 14,
    },
  }
}
