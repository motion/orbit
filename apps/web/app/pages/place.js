import React from 'react'
import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from '@jot/models'
import { Segment, Button, CircleButton } from '~/ui'
import NotFound from '~/pages/notfound'
import Page from '~/views/page'
import Router from '~/router'
import DocumentPage from '~/pages/doc'

@view.provide({
  placeStore: class PlaceStore {
    place = Place.get({ slug: this.props.slug || Router.params.slug })
    doc = null

    start() {
      this.watch(async () => {
        if (this.place) {
          this.doc = await Document.homeForPlace(this.place._id).exec()
        }
      })
    }

    createDoc = title => {
      Document.create({ title, places: [this.place.slug] })
    }

    deleteAll = () => {
      Place.all()
        .exec()
        .then(docs => docs.map(doc => doc.delete()))
        .then(docs => console.log('deleted', docs))

      Document.all()
        .exec()
        .then(docs => docs.map(doc => doc.delete()))
        .then(docs => console.log('deleted', docs))
    }
  },
})
export default class PlacePage {
  render({ placeStore }) {
    const { place, doc } = placeStore

    if (!place) {
      return <Page loading />
    }

    if (place === null) {
      return <NotFound />
    }

    if (!doc) {
      return <NotFound />
    }

    const actions = (
      <Segment>
        <Button
          tooltip="share link"
          icon="uilink"
          onClick={() => console.log(place.url())}
        />
        <Button
          icon={place.subscribed() ? 'userdelete' : 'useradd'}
          iconColor={place.subscribed() ? 'green' : '#ccc'}
          tooltip={place.subscribed() ? 'unfollow' : 'follow'}
          onClick={place.toggleSubscribe}
        />
        <Button
          icon={place.private ? 'eye-ban' : 'eye'}
          tooltip={place.private ? 'make public' : 'make private'}
          onClick={place.togglePrivate}
        />
      </Segment>
    )

    if (place.private && !App.loggedIn) {
      return (
        <Page actions={actions}>
          <content $$centered>
            this place is private!
            <Button>login to join</Button>
          </content>
        </Page>
      )
    }

    console.log('place with doc', doc._id)
    return (
      <Page place={place} doc={doc} actions={actions}>
        <DocumentPage if={doc} insidePlace id={doc._id} />
      </Page>
    )
  }
}
