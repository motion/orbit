import React from 'react'
import { view } from '@jot/black'
import { Segment, Button } from '~/ui'
import Router from '~/router'
import DocumentView from '~/views/document'
import { User, Document } from '@jot/models'
import Page from '~/page'
import Theme from '~/theme'

@view.provide({
  docStore: class DocPageStore {
    doc = this.props.id ? Document.get(this.props.id) : Document.home()
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
  render({ docStore, insidePlace }) {
    const { doc } = docStore

    if (!doc) {
      return <err404>no doc found</err404>
    }

    const starred = doc.hasStar()

    return (
      <Page
        actions={
          <Segment>
            <Button if={!insidePlace} tooltip="share link">
              🔗
            </Button>
            <Button if={!insidePlace} onClick={doc.togglePrivate}>
              {doc.private ? '🙈' : '🌎'}
            </Button>
            <Button
              icon="fav31"
              color={starred ? Theme.light.base.highlightColor : '#000'}
              onClick={doc.toggleStar}
              tooltip={starred ? 'un-favorite' : 'favorite'}
            />
          </Segment>
        }
      >
        <DocumentView id={doc._id} onKeyDown={docStore.onKeyDown} />
      </Page>
    )
  }

  static style = {
    err404: {
      padding: 15,
    },
  }
}
