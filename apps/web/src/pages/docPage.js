// @flow
import React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import Explorer from '~/explorer'
import DocumentView from '~/views/document'
import { User, Document } from '@mcro/models'
import Page from '~/views/page'

@view.attach('explorerStore')
@view
class Actions {
  render({ explorerStore }) {
    const document = explorerStore.document
    log('RENDER', document)

    if (!document || document === null) {
      return null
    }

    if (typeof document.hasStar !== 'function') {
      log('doc is', document)
      return null
    }

    const starred = document.hasStar()
    const itemProps = {
      size: 1.5,
      chromeless: true,
      tooltipProps: {
        towards: 'left',
      },
    }

    return (
      <actions $$draggable>
        <UI.Button
          {...itemProps}
          icon="fav3"
          tooltip={starred ? 'Unfollow' : 'Follow'}
          highlight={starred}
          onClick={document.toggleStar}
        />
        <UI.Button
          {...itemProps}
          chromeless
          icon="design-f"
          tooltip="Threads"
          highlight={explorerStore.showDiscussions}
          onClick={explorerStore.ref('showDiscussions').toggle}
          badge={1}
        />
        <UI.Popover
          elevation={3}
          borderRadius={8}
          background="transparent"
          distance={10}
          forgiveness={16}
          towards="left"
          delay={150}
          target={
            <UI.Button {...itemProps} opacity={0.5} chromeless icon="dot" />
          }
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
                icon: 'bell',
                primary: 'Ping +3',
                onClick: () => console.log(),
              },
              {
                icon: 'gear',
                primary: 'Settings',
                onClick: () => console.log(),
              },
            ]}
          />
        </UI.Popover>
      </actions>
    )
  }

  static style = {
    actions: {
      position: 'absolute',
      top: 50,
      right: 10,
      height: 110,
      alignItems: 'flex-end',
      zIndex: 1000,
      justifyContent: 'space-between',
    },
  }
}

class DocPageStore {
  @watch
  doc = () => (this.props.id ? Document.get(this.props.id) : Document.home())
  forceEdit = false
  showDiscussions = false

  start() {
    this.watch(() => {
      log('watch running for doc')
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

        <docpagecontent>
          <DocumentView
            if={!docStore.showInbox}
            id={doc._id}
            onKeyDown={docStore.onKeyDown}
            showCrumbs
            showChildren
            isPrimaryDocument
          />
        </docpagecontent>

        <Explorer />
      </Page>
    )
  }

  static style = {
    docpagecontent: {
      flex: 1,
      overflow: 'hidden',
      paddingRight: 30,
      paddingTop: 32,
    },
  }
}
