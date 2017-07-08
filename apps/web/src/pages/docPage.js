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
        this.props.explorerStore.setPath(this.doc)
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

@view.attach('explorerStore')
@view({
  docStore: DocPageStore,
})
export default class DocumentPage {
  extraRef = null

  render({ docStore }: { docStore: DocPageStore }) {
    const { doc } = docStore

    if (doc === undefined) {
      return <null />
    }
    if (!doc) {
      return <UI.Placeholder size={2}>Doc 404</UI.Placeholder>
    }

    const starred = doc.hasStar()
    const itemProps = {
      size: 1,
      iconSize: 18,
      chromeless: true,
    }

    return (
      <Page>
        <Page.Actions $$row $$centered>
          <UI.Segment itemProps={itemProps}>
            <UI.Popover
              background
              elevation={3}
              borderRadius={8}
              background="transparent"
              distance={10}
              forgiveness={16}
              delay={150}
              target={<UI.Button chromeless icon="dot" />}
              openOnHover
              closeOnClick
            >
              <UI.List
                width={150}
                padding={3}
                itemProps={{
                  height: 32,
                  fontSize: 14,
                  borderWidth: 0,
                  borderRadius: 8,
                }}
                items={[
                  {
                    icon: 'gear',
                    primary: 'Settings',
                    onClick: () => console.log(),
                  },
                ]}
              />
            </UI.Popover>
            <UI.Button
              icon="fav31"
              highlight={!!starred}
              onClick={doc.toggleStar}
            />
          </UI.Segment>
        </Page.Actions>
        <DocumentView
          if={!docStore.showInbox}
          id={doc._id}
          onKeyDown={docStore.onKeyDown}
          showCrumbs
          showChildren
          isPrimaryDocument
        />
        <Inbox doc={doc} if={docStore.showInbox} />
      </Page>
    )
  }
}
