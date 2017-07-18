import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocView from '~/views/document'
import { Document, Thread } from '@mcro/models'

class ThreadDraftStore {
  draftVersion = 1
  @watch
  draft = () =>
    this.draftVersion &&
    Document.createTemporary({
      title: 'Draft',
      threadId: this.threadId,
      draft: true,
      type: 'thread',
    })

  get document() {
    return this.props.document || {}
  }

  get threadId() {
    return this.document && this.document.id
  }

  send = async () => {
    let threadId = this.document.threadId
    let thread
    const isNewThread = !threadId

    if (isNewThread) {
      thread = await Thread.create({
        title: this.draft.title,
        docId: 'null',
      })
      threadId = thread.id
    }

    this.draft.threadId = threadId
    this.draft.draft = false // no draft
    await this.draft.save()

    // quick, reset draft
    this.draftVersion++

    if (isNewThread) {
      thread.docId = this.draft.id
      await thread.save()
    }

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
  render({ store, isReply, store: { draft }, ...props }) {
    return (
      <UI.Theme name="light">
        <draft {...props}>
          <draftdoc>
            <DocView
              if={draft}
              id={draft.id}
              document={draft}
              inline
              noTitle={isReply}
            />
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
