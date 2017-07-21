import { view, watch, HotKeys } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocView from '~/views/document'
import { Reply, Thread } from '~/app'

class DraftStore {
  draftVersion = 1
  @watch
  draft = () =>
    this.draftVersion &&
    this.model.createTemporary({
      title: 'Draft',
      parentId: (this.document && this.document.parentId) || undefined,
      draft: true,
    })

  get document() {
    return this.props.document
  }

  get model() {
    return this.document ? Reply : Thread
  }

  send = async () => {
    this.draft.draft = false
    await this.draft.save()

    // quick, reset draft
    this.draftVersion++

    if (this.props.closePopover) {
      this.props.closePopover()
    }
  }

  destroy = () => {
    this.doc.remove()
  }

  shortcuts = {
    cmdEnter: this.send,
  }
}

@view({
  store: DraftStore,
})
export default class Draft {
  editor = null

  render({
    editorRef,
    placeholder,
    store,
    isReply,
    store: { draft },
    document,
    closePopover,
    ...props
  }) {
    return (
      <HotKeys handlers={store.shortcuts}>
        <UI.Theme name="light">
          <draft {...props}>
            <draftdoc>
              <DocView
                if={draft}
                id={draft.id}
                document={draft}
                inline
                noTitle={isReply}
                editorRef={editorRef}
                placeholder={placeholder}
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
      </HotKeys>
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
