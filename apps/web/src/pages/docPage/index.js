// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { User } from '@mcro/models'
import Page from '~/views/page'
import Children from './children'
import Actions from './actions'
import Thread from '~/views/inbox/thread'
import Inbox from '~/views/inbox'

class DocPageStore {
  forceEdit = false
  showDiscussions = false

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

  render({ docStore, explorerStore }: { docStore: DocPageStore }) {
    const { document } = explorerStore

    // this is the "loading" state
    if (document === undefined) {
      return null
    }

    if (!document) {
      return <UI.Placeholder size={2}>Doc 404</UI.Placeholder>
    }

    const isDoc = !document.type || document.type === 'document'
    const isInbox = document.type === 'inbox'
    const isThread = document.type === 'thread'

    return (
      <Page>
        <docpagecontent id="content">
          <Inbox if={isInbox} document={document} />
          <DocumentView
            if={isDoc || isThread}
            $isDoc={isDoc}
            $isThread={isThread}
            document={document}
            onKeyDown={docStore.onKeyDown}
            showCrumbs
            showChildren
            isPrimaryDocument
          />
          <Thread if={isThread} document={document} />
        </docpagecontent>

        <sidebar if={isDoc || isThread}>
          <Actions />
          <Children if={!isThread} documentStore={docStore} />
        </sidebar>
      </Page>
    )
  }

  static style = {
    docpagecontent: {
      flex: 1,
      overflow: 'hidden',
      zIndex: 20,
      overflowY: 'scroll',
      position: 'relative',
    },
    sidebar: {
      width: 135,
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 50,
      top: 0,
      right: 0,
      bottom: 60,
      pointerEvents: 'none',
    },
    fade: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to left, white, transparent)',
      width: 100,
      zIndex: 30,
    },
    isDoc: {
      paddingRight: 140,
    },
    isThread: {
      flex: 'none',
      paddingBottom: 20,
    },
  }
}
