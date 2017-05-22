import React from 'react'
import { view } from '~/helpers'
import { Segment, Button } from '~/ui'
import Router from '~/router'
import DocumentView from '~/views/document'
import { Document } from '@jot/models'
import Page from '~/views/page'

@view({
  store: class DocPageStore {
    doc = Document.get(this.props.id || Router.params.id)
    forceEdit = false

    get editing() {
      return this.forceEdit || (App.loggedIn && !App.user.hatesToEdit)
    }

    toggleEdit = () => {
      this.forceEdit = !this.forceEdit
    }
  },
})
export default class DocumentPage {
  render({ store, insidePlace }) {
    const { doc } = store

    if (!doc) {
      return null
    }

    return (
      <Page
        extraActions={
          <Segment>
            <Button
              if={!insidePlace}
              tooltip="share link"
              onClick={() => console.log(place.url())}
            >
              🔗
            </Button>
            <Button if={!insidePlace} onClick={doc.togglePrivate}>
              {doc.private ? '🙈' : '🌎'}
            </Button>
            <Button onClick={store.toggleEdit}>
              {store.forceEdit ? 'publish' : 'edit'}
            </Button>
          </Segment>
        }
      >
        <DocumentView document={doc} onKeyDown={store.onKeyDown} />
      </Page>
    )
  }
}
