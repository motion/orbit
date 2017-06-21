import React from 'react'
import { view } from '@jot/black'
import { Segment, Button } from '~/ui'
import Router from '~/router'
import DocumentView from '~/views/document'
import { User, Document } from '@jot/models'
import Page from '~/page'

@view.provide({
  docStore: class DocPageStore {
    doc = Document.get(this.props.id || Router.params.id)
    forceEdit = false

    get editing() {
      return this.forceEdit || (User.loggedIn && !User.user.hatesToEdit)
    }

    toggleEdit = () => {
      this.forceEdit = !this.forceEdit
    }
  },
})
export default class DocumentPage {
  render({ id, docStore, insidePlace }) {
    const { doc } = docStore

    if (!doc) {
      return <div>no doc found</div>
    }

    return (
      <Page
        actions={
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
          </Segment>
        }
      >
        <DocumentView id={doc._id} onKeyDown={docStore.onKeyDown} />
      </Page>
    )
  }
}
