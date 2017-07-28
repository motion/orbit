import { view, watch, HotKeys } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocView from '~/views/document'
import { Reply, Thread } from '~/app'
import Router from '~/router'

const REC_SPEED = 800

class DraftStore {
  draftVersion = 1
  recs = []

  @watch
  draft = () => {
    return (
      this.draftVersion &&
      this.model.createTemporary({
        title: 'Draft',
        parentId: this.props.parentId || undefined,
        draft: true,
      })
    )
  }

  get model() {
    return this.props.isReply ? Reply : Thread
  }

  get isReply() {
    return !!this.props.isReply
  }

  lastText = ''
  getRec = async () => {
    log('getRec')
    if (this.draft) {
      const { recStore } = this.props
      const text = this.draft.title + ' ' + this.draft.previewText
      if (text && text.length > 10 && this.lastText !== text) {
        const res = await recStore.getTag(text)
        if (res) this.recs = res.map(i => i.label)
      }

      this.lastText = text
    }
  }

  start() {
    if (!this.isReply) {
      // this is a ridiculous loop
      // this.setTimeout(this.getRec, REC_SPEED)
    }
  }

  send = async () => {
    console.log('in send')
    this.draft.draft = false
    await this.draft.save()

    if (!this.isReply) {
      Router.go(this.draft.url())
    }

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

@view.attach('recStore')
@view({
  store: DraftStore,
})
export default class Draft {
  editor = null

  render({
    onEditorStore,
    placeholder,
    store,
    isReply,
    parentId,
    store: { draft },
    closePopover,
    recStore,
    focus,
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
                onEditorStore={onEditorStore}
                placeholder={placeholder}
                focus={focus}
                css={{
                  minHeight: 100,
                }}
              />
            </draftdoc>
            <actions if={draft} $$row>
              <badges if={!store.isReply} $$row>
                {store.recs.slice(0, 2).map(rec =>
                  <UI.Badge>
                    {rec}
                  </UI.Badge>
                )}
              </badges>
              <status if={store.isReply} $$row $$centered>
                <reminder if={false}>
                  <UI.Checkbox marginRight={10} />
                  <UI.Text size={0.8}>
                    Remind me <b>in 2 days</b> if no reply
                  </UI.Text>
                </reminder>
              </status>
              <UI.Row spaced>
                <UI.Button
                  if={store.hasContent}
                  onClick={store.destroy}
                  chromeless
                  opacity={0.5}
                >
                  Cancel
                </UI.Button>
                <UI.Button icon="send" onClick={store.send}>
                  Send
                </UI.Button>
              </UI.Row>
            </actions>
          </draft>
        </UI.Theme>
      </HotKeys>
    )
  }

  static style = {
    draft: {
      padding: [0, 15],
      width: '100%',
    },
    draftdoc: {
      // padding: [0, 10],
      marginLeft: -15,
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
      marginTop: 10,
      padding: [10, 0],
      justifyContent: 'space-between',
    },
    buttons: {
      justifyContent: 'flex-end',
    },
  }
}
