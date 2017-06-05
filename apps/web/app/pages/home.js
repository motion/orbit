import React from 'react'
import { view } from '~/helpers'
import App, { Place, Document } from '@jot/models'
import PlacePage from './place'
import DocumentView from '~/views/document'
import { BLOCKS } from '~/editor/constants'

@view({
  store: class PlaceTileStore {
    document = Document.forPlace(this.props.place._id)
  },
})
class PlaceTile {
  render({ store: { document } }) {
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
    userPlace = Place.get(App.loggedIn && App.user.name)
    places = Place.all()
  },
})
export default class HomePage {
  render({ store }) {
    if (!store.places) {
      return null
    }

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
