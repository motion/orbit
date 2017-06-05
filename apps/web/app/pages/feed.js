import React from 'react'
import { view } from '~/helpers'
import { Place, Document } from '@jot/models'
import FlipMove from 'react-flip-move'
import { Button } from '~/ui'
import Page from '~/page'
import DocItem from '~/views/document/item'

class FeedStore {
  docs = Document.recent()
  place = null

  createDoc = e => {
    e.preventDefault()
    Document.create()
  }

  createPlace = e => {
    e.preventDefault()
    Place.create({
      title: this.place.value,
      authorId: App.user.name,
    })
  }
}

@view({
  store: FeedStore,
})
export default class Feed {
  render({ store }) {
    return (
      <Page
        header
        $$padded
        title="Feed"
        actions={[
          <Button circular icon="📇" onClick={store.createDoc}>
            new
          </Button>,
        ]}
      >
        <FlipMove $docs duration={300} easing="ease-out">
          {(store.docs || [])
            .map((doc, i) => <DocItem key={doc._id} slanty feed doc={doc} />)}
        </FlipMove>
      </Page>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      maxHeight: '100%',
      position: 'relative',
    },
  }
}
