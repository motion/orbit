// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import { PassProps, Segment, Button, Popover, List } from '@mcro/ui'
import Router from '~/router'
import DocumentView from '~/views/document'
import { User, Document } from '@mcro/models'
import Page from '~/views/page'
import Theme from '~/theme'
import Inbox from '~/views/inbox'

class DocPageStore {
  doc = this.props.id ? Document.get(this.props.id) : Document.home()
  forceEdit = false
  showInbox = false

  start() {
    this.watch(() => {
      if (this.doc) {
        this.props.commanderStore.setPath(this.doc)
      }
    })
  }

  get editing() {
    return this.forceEdit || (User.loggedIn && !User.user.hatesToEdit)
  }
  toggleEdit = () => {
    this.forceEdit = !this.forceEdit
  }
}

@view.attach('commanderStore')
@view({
  docStore: DocPageStore,
})
export default class DocumentPage {
  render({
    docStore,
    commanderStore,
    insidePlace,
  }: {
    docStore: DocPageStore,
  }) {
    const { doc } = docStore

    // just to setup a mobx bind
    commanderStore.focused

    if (doc === undefined) {
      return <null />
    }
    if (!doc) {
      return <UI.Placeholder size={3}>Doc 404</UI.Placeholder>
    }

    const starred = doc.hasStar()

    return (
      <Page
        actions={
          <actions
            if={!commanderStore.focused}
            key={Math.random()}
            $$row
            $$centered
          >
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
              <Button getRef={this.ref('extraRef').set} icon="dot" />
              <Button
                icon="fav31"
                highlight={!!starred}
                onClick={doc.toggleStar}
              />
            </Segment>
            <Popover
              openOnHover
              openOnClick
              width={120}
              shadow
              background
              target={() => this.extraRef}
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
          </actions>
        }
      >
        <DocumentView
          if={!docStore.showInbox}
          id={doc._id}
          onKeyDown={docStore.onKeyDown}
          showCrumbs
          showChildren
        />
        <Inbox if={docStore.showInbox} />
      </Page>
    )
  }

  static style = {
    err404: {
      padding: 15,
    },
  }
}
