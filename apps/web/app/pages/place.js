import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from '@jot/models'
import { Segment, Button, CircleButton } from '~/ui'
import NotFound from '~/pages/notfound'
import Page from '~/views/page'
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

    const actions = (
      <Segment>
        <Segment.Item
          tooltip="share link"
          onClick={() => console.log(place.url())}
        >
          🔗
        </Segment.Item>
        <Segment.Item tooltip="delete all" onClick={store.deleteAll}>
          rm
        </Segment.Item>
        <Segment.Item
          tooltip={place.subscribed() ? 'unfollow' : 'follow'}
          onClick={place.toggleSubscribe}
        >
          {place.subscribed() ? '✅' : '🍻'}
        </Segment.Item>
        <Segment.Item
          tooltip={place.private ? 'make public' : 'make private'}
          onClick={place.togglePrivate}
        >
          {place.private ? '🙈' : '🌎'}
        </Segment.Item>
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

    return (
      <Page place={place} doc={doc} actions={actions}>
        <DocumentView focusOnMount if={doc} document={doc} />
      </Page>
    )
  }
}
