// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import DocumentView from '~/views/document'
import { User, Document } from '@mcro/models'
import Page from '~/views/page'
import Inbox from '~/views/inbox'
import Children from '~/explorer/children'

const itemProps = {
  size: 1.5,
  chromeless: true,
  tooltipProps: {
    towards: 'left',
  },
}

@view.attach('explorerStore')
@view
class Actions {
  render({ explorerStore }) {
    const document = explorerStore.document

    if (!document || document === null) {
      return null
    }

    if (typeof document.hasStar !== 'function') {
      log('hmr caused a bad thing')
      return null
    }

    log('render actions')

    const popoverProps = {
      elevation: 3,
      borderRadius: 8,
      background: 'transparent',
      distance: 10,
      forgiveness: 16,
      towards: 'right',
      delay: 150,
      openOnHover: true,
      closeOnClick: true,
    }

    return (
      <actions $$draggable>
        <UI.Button
          if={false}
          {...itemProps}
          chromeless
          icon="design-f"
          tooltip="Threads"
          tooltipProps={{ towards: 'right' }}
          highlight={explorerStore.showDiscussions}
          onClick={explorerStore.ref('showDiscussions').toggle}
          badge={1}
        />

        <UI.Popover
          {...popoverProps}
          target={
            <UI.Button
              {...itemProps}
              opacity={0.5}
              chromeless
              css={{ textAlign: 'right' }}
            >
              <UI.Text size={0.8}>+3 people</UI.Text>
              <UI.Text size={0.8} color={[0, 0, 0, 0.5]}>
                Jan 3rd
              </UI.Text>
            </UI.Button>
          }
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
          >
            <UI.List.Item icon="gear" primary="Settings" />
            <UI.Popover
              {...popoverProps}
              target={<UI.List.Item icon="bell" primary="Ping +3" />}
              towards="right"
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
              >
                <UI.List.Item icon="all" primary="All" color="black" />
                <UI.List.Item icon="girl" primary="Jamie S." />
                <UI.List.Item icon="boy" primary="Angela M." />
                <UI.List.Item icon="boy" primary="Theresa M." />
              </UI.List>
            </UI.Popover>
          </UI.List>
        </UI.Popover>
      </actions>
    )
  }

  static style = {
    actions: {
      position: 'absolute',
      top: 10,
      right: 10,
      height: 98,
      alignItems: 'flex-end',
      zIndex: 1000,
      justifyContent: 'space-between',
      // flexFlow: 'row',
    },
  }
}

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

    if (document === undefined) {
      return <null />
    }
    if (!document) {
      return <UI.Placeholder size={2}>Doc 404</UI.Placeholder>
    }

    return (
      <Page>
        <Page.Actions if={false}>
          <UI.Button
            onClick={docStore.ref('showInbox').toggle}
            highlight={docStore.showInbox}
            chromeless
            icon="message"
          >
            Threads
          </UI.Button>
        </Page.Actions>

        <Actions />

        <Inbox
          if={explorerStore.showDiscussions}
          document={explorerStore.document}
        />

        <fade />

        <docpagecontent>
          <DocumentView
            document={document}
            onKeyDown={docStore.onKeyDown}
            showCrumbs
            showChildren
            isPrimaryDocument
          />
        </docpagecontent>

        <children>
          <Children documentStore={docStore} />
        </children>

        <UI.Button
          {...itemProps}
          icon="fav3"
          tooltip={document.hasStar ? 'Unfollow' : 'Follow'}
          highlight={document.hasStar}
          onClick={document.toggleStar}
        />
      </Page>
    )
  }

  static style = {
    docpagecontent: {
      flex: 1,
      overflow: 'hidden',
      flexFlow: 'row',
      zIndex: 20,
      position: 'relative',
    },
    children: {
      position: 'absolute',
      overflow: 'hidden',
      zIndex: 50,
      top: 0,
      right: 0,
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
