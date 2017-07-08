// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Explorer from '~/explorer'
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
      size: 1.6,
      chromeless: true,
      tooltipProps: {
        towards: 'left',
      },
    }

    return (
      <Page>
        <Page.Actions if={false}>
          <UI.Button chromeless icon="drop">
            Inbox
          </UI.Button>
        </Page.Actions>

        <actions $$draggable>
          <UI.Button
            {...itemProps}
            icon="door"
            tooltip={starred ? 'Unfollow' : 'Follow'}
            highlight={starred}
            onClick={doc.toggleStar}
          />
          <UI.Button
            {...itemProps}
            chromeless
            icon="design-f"
            tooltip="Discuss"
          />
          <UI.Popover
            background
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
                  icon: 'gear',
                  primary: 'Settings',
                  onClick: () => console.log(),
                },
              ]}
            />
          </UI.Popover>
        </actions>

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

        <Inbox doc={doc} if={docStore.showInbox} />
      </Page>
    )
  }

  static style = {
    actions: {
      position: 'absolute',
      top: 10,
      right: 10,
      height: 110,
      alignItems: 'flex-end',
      zIndex: 1000,
      justifyContent: 'space-between',
    },
    docpagecontent: {
      paddingRight: 30,
    },
  }
}
