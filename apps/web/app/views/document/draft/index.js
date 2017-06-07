// @flow
import React from 'react'
import { view, computed } from '~/helpers'
import { Portal, Drawer, Button, Icon } from '~/ui'
import DocView from '~/views/document'
import { Document, User } from '@jot/models'
import Router from '~/router'

class DraftStore {
  doc = null

  onSaveDraft = async () => {
    this.doc.draft = false
    await this.doc.save()
    Router.go(this.doc.url())
    this.doc = null
    this.onClose()
  }

  onCreateDraft = async () => {
    const params = {
      draft: true,
      // places: [App.activePage.place._id],
      authorId: User.user.name,
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
    if (!this.props.isActive && isActive) this.props.store.onCreateDraft()
  }

  render({ isActive, store }) {
    const { doc } = store

    return (
      <draft>
        <Portal isOpened={true} isOpen={true}>
          <Drawer
            from="bottom"
            open={isActive}
            overlayBlur={5}
            onClickOverlay={store.onClose}
          >
            <content if={isActive && store.doc}>
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
