// @flow
import React from 'react'
import { view, computed } from '~/helpers'
import { Drawer, Button, Icon } from '~/ui'
import DocView from '~/views/document'
import { Document } from '@jot/models'
import Router from '~/router'
import Portal from 'react-portal'

@view class CreateButton {
  render(props) {
    return (
      <div>
        <Button circle {...props} $circleButton icon="add" />
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

  afterOpen = false
  blurBg = false

  @computed get isActive() {
    return this.doc !== null
  }

  onSaveDraft = async () => {
    this.doc.draft = false
    await this.doc.save()
    Router.go(this.doc.url())
    this.doc = null
  }

  onCreateDraft = async () => {
    const params = {
      draft: true,
      places: [App.activePage.place._id],
      title: 'New Draft',
    }

    this.doc = await Document.create(params)
  }

  onClose = () => {
    this.doc = null
  }
}

@view({
  store: DraftStore,
})
export default class Draft {
  render({ store }) {
    const { isActive, doc } = store

    return (
      <draft>
        <Drawer
          closeOnEsc
          from="bottom"
          open={isActive}
          overlayBlur={3}
          onClickOverlay={store.onClose}
        >
          <content if={isActive}>
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
        <CreateButton onClick={store.onCreateDraft} />
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
