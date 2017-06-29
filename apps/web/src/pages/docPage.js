// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import { PassProps, Segment, Button, Popover, List } from '@mcro/ui'
import Router from '~/router'
import DocumentView from '~/views/document'
import { User, Document } from '@mcro/models'
import Page from '~/views/page'
import Theme from '~/theme'

class DocPageStore {
  doc = this.props.id ? Document.get(this.props.id) : Document.home()
  forceEdit = false
  showInbox = false

  get editing() {
    return this.forceEdit || (User.loggedIn && !User.user.hatesToEdit)
  }
  toggleEdit = () => {
    this.forceEdit = !this.forceEdit
  }
}

@view({
  docStore: DocPageStore,
})
export default class DocumentPage {
  render({ docStore, insidePlace }: { docStore: DocPageStore }) {
    const { doc } = docStore
    if (doc === undefined) {
      return <null />
    }
    if (!doc) {
      return <err>no doc found</err>
    }

    const starred = doc.hasStar()

    console.log(docStore.showInbox)
    return (
      <Page
        actions={
          <actions key={Math.random()} $$row $$centered>
            <Button
              active={docStore.showInbox}
              chromeless
              margin={[0, 10]}
              icon="paper"
              onClick={docStore.ref('showInbox').toggle}
            >
              Inbox
            </Button>

            <Segment
              itemProps={{
                size: 1,
                iconSize: 18,
                chromeless: true,
              }}
            >
              <Button className="wop" icon="dot" />
              <Button
                icon="fav31"
                highlight={!!starred}
                onClick={doc.toggleStar}
              />
            </Segment>
          </actions>
        }
      >
        <Popover
          openOnHover
          openOnClick
          width={120}
          shadow
          background
          target=".wop"
        >
          <List
            size={2}
            items={[
              { icon: 'share', primary: 'Share Link', onClick: () => {} },
              {
                icon: doc.private ? 'lock' : 'open',
                primary: 'Locked',
                onClick: doc.togglePrivate,
              },
              {
                icon: doc.private ? 'eye' : 'closed',
                primary: 'Private',
                onClick: doc.togglePrivate,
              },
            ]}
          />
        </Popover>
        <DocumentView
          id={doc._id}
          onKeyDown={docStore.onKeyDown}
          showCrumbs
          showChildren
        />
      </Page>
    )
  }

  static style = {
    err404: {
      padding: 15,
    },
  }
}
