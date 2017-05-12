import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from '@jot/models'
import { Text, Page, Button, CircleButton, NotFound } from '~/views'
import Router from '~/router'
import DocumentView from '~/views/document'

@view({
  store: class PlaceStore {
    place = Place.get(this.props.slug || Router.params.slug)
    doc = Document.homeForPlace(this.props.slug || Router.params.slug)

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
  render({ store }) {
    const { place, doc } = store

    if (!place) {
      return <Page loading />
    }

    if (place === null) {
      return <NotFound />
    }

    if (place.private && !App.loggedIn) {
      return (
        <Page>
          <content $$centered>
            this place is private!
            <Button>login to join</Button>
          </content>
        </Page>
      )
    }

    return (
      <Page
        place={place}
        doc={doc}
        actions={[
          <Button tooltip="share link" onClick={() => console.log(place.url())}>
            🔗
          </Button>,
          <Button tooltip="delete all" onClick={store.deleteAll}>
            rm -rf
          </Button>,
          <Button
            tooltip={place.subscribed() ? 'unfollow' : 'follow'}
            onClick={place.toggleSubscribe}
          >
            {place.subscribed() ? '✅' : '🍻'}
          </Button>,
          <Button
            tooltip={place.private ? 'make public' : 'make private'}
            onClick={place.togglePrivate}
          >
            {place.private ? '🙈' : '🌎'}
          </Button>,
        ]}
      >
        <DocumentView focusOnMount if={doc} document={doc} />
      </Page>
    )
  }
}
