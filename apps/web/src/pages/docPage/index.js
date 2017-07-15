// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { User } from '@mcro/models'
import Page from '~/views/page'
<<<<<<< HEAD
import Inbox from '~/views/inbox'
import Children from './children'
import Actions from './actions'
=======
import Children from './children'
import Actions from './actions'
import Inbox from '~/views/inbox'
>>>>>>> 34bbc339ffd780c25f162749e02aa9b589a0e66e

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

@view.attach('explorerStore', 'layoutStore')
@view({
  docStore: DocPageStore,
})
export default class DocumentPage {
  extraRef = null

  render({ docStore, explorerStore, layoutStore }: { docStore: DocPageStore }) {
    const { document } = explorerStore

    if (document === undefined) {
      return <null />
    }
    if (!document) {
      return <UI.Placeholder size={2}>Doc 404</UI.Placeholder>
    }

<<<<<<< HEAD
    return (
      <Page>
        <Page.Actions>
          <UI.Button
            size={1.25}
            borderWidth={0}
            icon="fav3"
            tooltip={document.hasStar ? 'Stop watching' : 'Watch'}
            tooltipProps={{ towards: 'left' }}
            highlight={document.hasStar}
            onClick={() => document.toggleStar()}
            after={<div>hi222222222</div>}
          />
        </Page.Actions>

        <fade />
        <Inbox document={document} />

        <docpagecontent>
          <DocumentView
=======
    const isDoc = !document.type || document.type === 'document'

    return (
      <Page>
        <Page.Actions>
          <UI.Popover
            openOnHover
            background
            width={480}
            borderRadius={8}
            elevation={2}
            adjust={[140, 0]}
            target={<UI.Button chromeless size={1.2} badge={2} icon="bell" />}
          >
            <content />
          </UI.Popover>

          <UI.Button
            chromeless
            spaced
            size={0.7}
            margin={[0, -5, 0, 0]}
            icon={
              layoutStore.sidebar.active ? 'arrow-min-right' : 'arrow-min-left'
            }
            onClick={layoutStore.sidebar.toggle}
            color={[0, 0, 0, 0.3]}
          />
        </Page.Actions>

        <docpagecontent>
          <Inbox if={document.type === 'thread'} />
          <DocumentView
            if={isDoc}
            $$paddingRight={120}
>>>>>>> 34bbc339ffd780c25f162749e02aa9b589a0e66e
            document={document}
            onKeyDown={docStore.onKeyDown}
            showCrumbs
            showChildren
            isPrimaryDocument
          />
        </docpagecontent>

<<<<<<< HEAD
        <sidebar>
=======
        <sidebar if={isDoc}>
>>>>>>> 34bbc339ffd780c25f162749e02aa9b589a0e66e
          <Actions />
          <Children documentStore={docStore} />
        </sidebar>

        <bottomright
          css={{ position: 'absolute', bottom: 10, right: 10, zIndex: 100000 }}
        >
          <UI.Button
<<<<<<< HEAD
            if={false}
            chromeless
            spaced
            size={0.7}
            margin={[0, -5, 0, 0]}
            icon={
              layoutStore.sidebar.active ? 'arrow-min-right' : 'arrow-min-left'
            }
            onClick={layoutStore.sidebar.toggle}
            color={[0, 0, 0, 0.3]}
=======
            size={1.5}
            borderWidth={0}
            icon="fav3"
            tooltip={document.hasStar ? 'Stop watching' : 'Watch'}
            tooltipProps={{ towards: 'left' }}
            highlight={document.hasStar}
            onClick={() => document.toggleStar()}
            after={<div>hi222222222</div>}
>>>>>>> 34bbc339ffd780c25f162749e02aa9b589a0e66e
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
<<<<<<< HEAD
      paddingRight: 120,
=======
>>>>>>> 34bbc339ffd780c25f162749e02aa9b589a0e66e
      position: 'relative',
    },
    sidebar: {
      width: 160,
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 50,
      top: 0,
      right: 10,
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
