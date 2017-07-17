import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { random } from 'lodash'
import DocView from '~/views/document'

class ThreadDraftStore {
  document = Document.createTemporary({
    title: 'Draft',
    threadId: this.threadId,
    draft: true,
  })

  get activeItem() {
    return this.props.inboxStore.activeItem
  }

  get threadId() {
    return (this.activeItem && this.activeItem.id) || 'null'
  }

  send = () => {
    this.document.save()
  }

  destroy = () => {
    this.doc.remove()
  }
}

@view({
  store: ThreadDraftStore,
})
export default class Draft {
  render({ store, store: { document } }) {
    return (
      <draft>
        <top $$row>
          <UI.Title size={1}>
            <b>Nick</b>
          </UI.Title>
        </top>
        <DocView if={document} id={document.id} document={document} />
        <actions $$row if={document}>
          <status>
            <remind $$row>
              Remind me &nbsp;<b>in 2 days</b>&nbsp; if &nbsp;<b>no reply</b>&nbsp;
            </remind>
          </status>
          <buttons $$row>
            <UI.Button $discard onClick={store.destroy} chromeless>
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
      borderRadius: 5,
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
