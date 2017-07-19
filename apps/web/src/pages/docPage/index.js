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
export default class DocPage {
  extraRef = null

  render({ docStore, explorerStore }: { docStore: DocPageStore }) {
    const { document } = explorerStore

    // this is the "loading" state
    if (document === undefined) {
      return null
    }

    if (!document) {
      return (
        <UI.Placeholder $$margin="auto" size={2}>
          Doc 404
        </UI.Placeholder>
      )
    }

    const isDoc = !document.type || document.type === 'document'
    const isInbox = document.type === 'inbox'
    const isThread = document.type === 'thread'

    return (
      <Page>
        <docpagecontent id="content">
          <inbox if={isInbox} css={{ padding: [0, 10] }}>
            <Inbox document={document} />
          </inbox>
          <meta if={isThread}>
            assigned to {document.assignedTo}
            tags {JSON.stringify(document.tags)}
          </meta>
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
          <actions if={isThread} css={{ padding: [0, 30, 20] }}>
            <item $$row>
              <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
                Assign To:&nbsp;&nbsp;
              </UI.Text>
              <UI.Button inline>Nick</UI.Button>
              &nbsp;&nbsp;&nbsp;
              <UI.Button inline>Nate</UI.Button>
            </item>
            <space css={{ height: 10 }} />
            <item $$row>
              <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
                Label:&nbsp;&nbsp;
              </UI.Text>
              <UI.Button inline>Enhancement</UI.Button>
              &nbsp;&nbsp;&nbsp;
              <UI.Button inline>New issue</UI.Button>
            </item>
          </actions>
          <Thread if={isThread} thread={document} />
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
