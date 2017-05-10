import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocumentView from '~/views/document'

@view({
  store: class PlaceStore {
    place = Place.get(Router.params.slug)
    doc = Document.homeForPlace(Router.params.slug)

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
      return null
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
        actions={[
          <Button onClick={() => console.log(place.url())}>🔗</Button>,
          <Button onClick={store.createDoc}>+</Button>,
          <Button onClick={store.deleteAll}>- all</Button>,
          <Button onClick={place.toggleSubscribe}>
            {place.subscribed() ? '✅' : '🍻'}
          </Button>,
          <Button onClick={place.togglePrivate}>
            {place.private ? '🙈' : '🌎'}
          </Button>,
        ]}
      >
        <DocumentView if={doc} document={doc} />
        <form
          onSubmit={e => {
            e.preventDefault()
            store.createDoc(this.newDoc.value)
          }}
        >
          <input
            $create
            ref={this.ref('newDoc').set}
            placeholder="create doc (#tag to tag) (/ to search)"
          />
        </form>

        <hashtags>
          {`#all #btc #etherium #monero #day-trading #something`
            .split(' ')
            .map(tag => (
              <a
                $tag
                key={tag}
                onClick={() => Router.set('hashtag', tag.slice(1))}
              >
                {tag}
              </a>
            ))}
        </hashtags>
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
    hashtags: {
      flexFlow: 'row',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      padding: 10,
    },
    tag: {
      padding: [2, 5],
      background: '#fff',
      color: 'red',
      '&:hover': {
        background: '#eee',
      },
    },
  }
}
