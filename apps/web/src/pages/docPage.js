// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { User, Document } from '@mcro/models'
import Page from '~/views/page'
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
  render({ docStore, commanderStore }: { docStore: DocPageStore }) {
    const { doc } = docStore

    // just to setup a mobx bind
    commanderStore.focused

    if (doc === undefined) {
      return <null />
    }
    if (!doc) {
      return <UI.Placeholder size={2}>Doc 404</UI.Placeholder>
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
            <UI.Button
              active={docStore.showInbox}
              chromeless
              margin={[0, 10]}
              icon="paper"
              onClick={docStore.ref('showInbox').toggle}
              tooltip="inbox"
            >
              Inbox
            </UI.Button>

            <UI.Segment
              itemProps={{
                size: 1,
                iconSize: 18,
                chromeless: true,
              }}
            >
              <UI.Button getRef={this.ref('extraRef').set} icon="dot" />
              <UI.Button
                icon="fav31"
                highlight={!!starred}
                onClick={doc.toggleStar}
              />
            </UI.Segment>
          </actions>
        }
      >
        <UI.Popover open width={160} target={<UI.Button>test</UI.Button>}>
          <UI.List
            elevation={10}
            borderRadius={8}
            items={[
              {
                icon: 'share',
                primary: 'Share2',
                onClick: () => {},
              },
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
        </UI.Popover>
        <DocumentView
          if={!docStore.showInbox}
          id={doc._id}
          onKeyDown={docStore.onKeyDown}
          showCrumbs
          showChildren
        />
        <Inbox doc={doc} if={docStore.showInbox} />
      </Page>
    )
  }
}
