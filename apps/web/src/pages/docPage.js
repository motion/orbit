// @flow
import React from 'react'
import { view, watch } from '@jot/black'
import { PassProps, Segment, Button, Popover, List } from '@jot/ui'
import Router from '~/router'
import DocumentView from '~/views/document'
import { User, Document } from '@jot/models'
import Page from '~/views/page'
import Theme from '~/theme'

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

    const btnProps = {
      size: 1,
      chromeless: true,
      noGlow: true,
    }

    return (
      <Page
        actions={
          <actions $$row>
            <Segment>
              <Popover
                openOnHover
                shadow
                background
                target={<Button {...btnProps} icon="dot" />}
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
              <Button
                icon="fav31"
                highlight={starred}
                onClick={doc.toggleStar}
                {...btnProps}
              />
            </Segment>
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
