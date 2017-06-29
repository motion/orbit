// @flow
import React from 'react'
import { view, computed } from '@mcro/black'
import { Portal, Drawer, Button, Icon } from '@mcro/ui'
import DocView from '~/views/document'
import { Document } from '@mcro/models'

@view
class CreateButton {
  render(props) {
    return (
      <div>
        <Button circular size={1.5} $circleButton icon="siadd" {...props} />
      </div>
    )
  }

  static style = {
    circleButton: {
      position: 'absolute',
      right: 20,
      zIndex: 500,
      bottom: 20,
    },
  }
}

class DraftStore {
  doc = null

  @computed
  get isActive() {
    return this.doc !== null
  }

  onSaveDraft = async () => {
    this.doc.draft = false
    await this.doc.save()
    this.props.onClose()
    Router.go(this.doc.url())
    this.doc = null
  }

  onCreateDraft = async () => {
    const params = {
      draft: true,
      title: 'New Draft',
    }

    this.doc = await Document.create(params)
  }

  onClose = () => {
    this.doc = null
    this.props.onClose()
  }
}

@view({
  store: DraftStore,
})
export default class Draft {
  componentWillReceiveProps({ isActive }) {
    if (!this.props.isActive && isActive) {
      this.props.store.onCreateDraft()
    }
  }

  render({ store, isActive, onOpenDraft }) {
    const { doc } = store

    return (
      <draft>
        <Portal isOpened>
          <Drawer
            from="bottom"
            open={isActive}
            overlayBlur={5}
            onClickOverlay={store.onClose}
          >
            <content if={isActive && doc}>
              <editor>
                <DocView inline={false} id={doc._id} document={doc} />
              </editor>
              <submit>
                <Button onClick={store.onSaveDraft} icon="simple-add">
                  create document
                </Button>
              </submit>
            </content>
          </Drawer>
        </Portal>
        <CreateButton if={false} onClick={onOpenDraft} />
      </draft>
    )
  }

  static style = {
    editor: {
      flex: 10,
      overflow: 'scroll',
    },
    submit: {
      marginTop: 5,
      width: 180,
    },
    content: {
      borderTop: '1px solid #eee',
      padding: [10, 20],
      flex: 1,
    },
  }
}
