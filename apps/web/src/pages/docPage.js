// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { User, Document } from '@mcro/models'
import Page from '~/views/page'
import Inbox from '~/views/inbox'
import Breadcrumbs from './breadcrumbs'

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
  extraRef = null
  uniq = `btn-${Math.floor(Math.random() * 10000000000)}`

  render({ docStore, commanderStore }: { docStore: DocPageStore }) {
    const { doc } = docStore
    // setup a mobx bind
    commanderStore.focused

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
        <Page.Actions if={!commanderStore.focused} $$row $$centered>
          <UI.Button
            active={docStore.showInbox}
            margin={[0, 10]}
            icon="paper"
            onClick={docStore.ref('showInbox').toggle}
            tooltip="inbox"
          >
            Inbox
          </UI.Button>

          <UI.Segment itemProps={itemProps}>
            <UI.Button className={this.uniq} icon="dot" />
            <UI.Button
              icon="fav31"
              highlight={!!starred}
              onClick={doc.toggleStar}
            />
          </UI.Segment>
        </Page.Actions>
        <Breadcrumbs />
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
