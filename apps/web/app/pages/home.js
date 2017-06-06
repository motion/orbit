import React from 'react'
import { view, watch } from '~/helpers'
import { User, Place, Document } from '@jot/models'
import PlacePage from './place'
import DocumentView from '~/views/document'
import { BLOCKS } from '~/editor/constants'

@view({
  store: class PlaceTileStore {
    document = Document.homeForPlace(this.props.place._id)
  },
})
class PlaceTile {
  render({ store: { document } }) {
    console.log('place tile fetch', document)
    return (
      <DocumentView
        if={document}
        inline
        editorProps={{ onlyNode: BLOCKS.UL_LIST }}
        id={document._id}
      />
    )
  }
}

@view({
  store: class HomeStore {
    userPlace = watch(
      () => User.loggedIn && Place.get({ slug: User.user.name })
    )
    places = Place.all()
  },
})
export default class HomePage {
  render({ store }) {
    if (!store.places) {
      return null
    }

    console.log('HOME_STORE', store)
    return null

    return (
      <home>
        <top>
          <place>
            <title>Drafts</title>
            <PlaceTile if={store.userPlace} place={store.userPlace} />
          </place>
        </top>
        <grid>
          {store.places.map(place => (
            <PlaceTile key={place._id} place={place} />
          ))}
        </grid>
      </home>
    )
  }

  static style = {
    home: {
      flex: 1,
    },
  }
}
