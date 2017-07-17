import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocView from '~/views/document'
import { Document, Thread } from '@mcro/models'

class ThreadDraftStore {
  draft = Document.createTemporary({
    title: 'Draft',
    threadId: this.threadId,
    draft: true,
  })

  get document() {
    return this.props.document || this.props.inboxStore.document
  }

  get threadId() {
    return (this.document && this.document.id) || 'null'
  }

  send = async () => {
    // link back and forth
    // TODO put into model
    const thread = await Thread.create({
      title: this.draft.title,
      docId: 'null',
    })
    this.draft.threadId = thread.id
    await this.draft.save()
    thread.docId = this.draft.id
    await thread.save()
    if (this.props.closePopover) {
      this.props.closePopover()
    }
  }

  destroy = () => {
    this.doc.remove()
  }
}

@view({
  store: ThreadDraftStore,
})
export default class Draft {
  render({ store, store: { draft } }) {
    return (
      <UI.Theme name="light">
        <draft>
          <DocView if={draft} id={draft.id} document={draft} inline />
          <actions if={draft} $$row>
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
      </UI.Theme>
    )
  }

  static style = {
    draft: {
      padding: [10, 25],
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
  }
}
