// @flow
import React from 'react'
import { view, watch } from '@jot/black'
import { PassProps, Segment, Button, Popover, List } from '@jot/ui'
import Router from '/router'
import DocumentView from '/views/document'
import { User, Document } from '@jot/models'
import Page from '/page'
import Theme from '/theme'

class DocPageStore {
  doc = this.props.id ? Document.get(this.props.id) : Document.home()
  forceEdit = false
  get editing() {
    return this.forceEdit || (User.loggedIn && !User.user.hatesToEdit)
  }
  toggleEdit = () => {
    this.forceEdit = !this.forceEdit
  }
}

@view.provide({
  docStore: DocPageStore,
})
export default class DocumentPage {
  render({ docStore, insidePlace }) {
    const { doc } = docStore
    if (doc === undefined) {
      return <null />
    }
    if (!doc) {
      return <err>no doc found</err>
    }

    const starred = doc.hasStar()
    const className = `btn-${Math.floor(Math.random() * 100000000000)}`

    return (
      <Page
        actions={
          <actions $$row>
            <Segment>
              <PassProps size={1} chromeless noGlow>
                <Button icon="dot" className={className} />
                <Button
                  icon="fav31"
                  highlight={starred}
                  onClick={doc.toggleStar}
                />
              </PassProps>
            </Segment>

            <Popover
              delay={0}
              distance={10}
              openOnHover
              shadow
              background
              target={`.${className}`}
            >
              <List
                items={[
                  { icon: 'share', primary: 'Share Link', onClick: () => {} },
                  {
                    icon: doc.private ? 'lock' : 'open',
                    primary: 'Locked',
                    onClick: doc.togglePrivate,
                  },
                  {
                    icon: doc.private ? 'eye' : 'closed',
                    primary: 'Private',
                    onClick: doc.togglePrivate,
                  },
                ]}
              />
            </Popover>
          </actions>
        }
      >
        <DocumentView
          id={doc._id}
          onKeyDown={docStore.onKeyDown}
          showCrumbs
          showChildren
        />
      </Page>
    )
  }

  static style = {
    err404: {
      padding: 15,
    },
  }
}
