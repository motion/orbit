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
import Notifications from '~/notifications'
import Gemstone from '~/views/gemstone'

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

    if (!document) {
      return <UI.Placeholder size={2}>Doc 404</UI.Placeholder>
    }

    const isDoc = !document.type || document.type === 'document'

    return (
      <Page>
        <Page.Actions>
          <UI.Popover
            openOnClick
            closeOnEscape
            background
            width={480}
            borderRadius={8}
            elevation={2}
            target={
              <UI.Button chromeless size={1.2} badge={2} icon="circle-09" />
            }
          >
            <Notifications />
          </UI.Popover>
        </Page.Actions>

        <docpagecontent>
          <Inbox if={document.type === 'thread'} document={document} />
          <DocumentView
            if={isDoc}
            $$paddingRight={150}
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

        <bottomright
          css={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            zIndex: 100000,
            flexFlow: 'row',
            alignItems: 'center',
          }}
        >
          <above
            if={User.favoriteDocuments}
            css={{ flexFlow: 'row', margin: [0, 10] }}
          >
            {User.favoriteDocuments.map((doc, i) =>
              <UI.Popover
                key={i}
                openOnHover
                background
                theme="dark"
                borderRadius={5}
                elevation={2}
                target={<Gemstone document={doc} />}
              >
                helo
              </UI.Popover>
            )}
          </above>

          <UI.Button
            size={1.5}
            borderWidth={0}
            icon="fav3"
            tooltip={document.hasStar ? 'Stop watching' : 'Watch'}
            highlight={document.hasStar}
            iconSize={document.hasStar ? 20 : null}
            onClick={() => document.toggleStar()}
            width={44}
            padding={0}
            iconProps={{
              css: {
                transition: 'transform ease-in 80ms',
                scale: document.hasStar ? 1.1 : 1,
              },
            }}
          />
        </bottomright>
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
