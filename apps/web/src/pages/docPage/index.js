// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { User } from '@mcro/models'
import Page from '~/views/page'
import Children from './children'
import Actions from './actions'
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

    return (
      <Page>
        <docpagecontent>
          <Inbox if={document.type === 'thread'} document={document} />
          <DocumentView
            if={isDoc}
            $$paddingRight={140}
            document={document}
            onKeyDown={docStore.onKeyDown}
            showCrumbs
            showChildren
            isPrimaryDocument
          />
        </docpagecontent>

        <sidebar if={isDoc}>
          <Actions />
          <Children documentStore={docStore} />
        </sidebar>
      </Page>
    )
  }

  static style = {
    docpagecontent: {
      flex: 1,
      overflow: 'hidden',
      flexFlow: 'row',
      zIndex: 20,
      overflowY: 'scroll',
      position: 'relative',
    },
    sidebar: {
      width: 125,
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 50,
      top: 0,
      right: 0,
      bottom: 60,
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
  }
}
