import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
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

      Document.forPlace(this.place.slug)
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
      return <div>loading</div>
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
          <Button onClick={() => console.log(place.url())}>🔗</Button>,
          <Button onClick={store.createDoc}>+</Button>,
          <Button onClick={store.deleteAll}>rm -rf</Button>,
          <Button onClick={place.toggleSubscribe}>
            {place.subscribed() ? '✅' : '🍻'}
          </Button>,
          <Button onClick={place.togglePrivate}>
            {place.private ? '🙈' : '🌎'}
          </Button>,
        ]}
      >
        <docViewContainer>
          <DocumentView if={doc} document={doc} />
        </docViewContainer>
        <form
          onSubmit={e => {
            e.preventDefault()
            store.createDoc(this.newDoc.value)
            this.newDoc.value = ''
          }}
        >
          <input
            $create
            ref={this.ref('newDoc').set}
            placeholder="create doc (#tag to tag) (/ to search)"
          />
        </form>
      </Page>
    )
  }

  static style = {
    form: {
      width: '100%',
      padding: 10,
    },
    create: {
      width: '100%',
      padding: [8, 7],
      fontSize: 16,
      background: '#fff',
      border: [1, '#ddd'],
    },
  }
}
