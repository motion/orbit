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
          <draftdoc>
            <DocView if={draft} id={draft.id} document={draft} inline />
          </draftdoc>
          <actions if={draft} $$row>
            <status $$row $$centered>
              <UI.Checkbox marginRight={10} />
              <UI.Text size={0.8}>
                Remind me <b>in 2 days</b> if no reply
              </UI.Text>
            </status>
            <UI.Segment spaced>
              <UI.Button $discard onClick={store.destroy} chromeless>
                Cancel
              </UI.Button>
              <UI.Button icon="send" onClick={store.send}>
                Send
              </UI.Button>
            </UI.Segment>
          </actions>
        </draft>
      </UI.Theme>
    )
  }

  static style = {
    draft: {
      padding: [0, 15],
      borderRadius: 5,
      boxShadow: '0px 1px 0px #aaa',
    },
    draftdoc: {
      // padding: [0, 10],
      margin: [0, -15],
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
      padding: [10, 0],
      justifyContent: 'space-between',
    },
    buttons: {
      justifyContent: 'flex-end',
    },
  }
}
