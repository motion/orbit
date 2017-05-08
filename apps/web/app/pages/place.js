import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocPage from '~/views/document/page'

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

    return (
      <Page
        title={
          <title if={place} $$row $$align="center">
            <Button onClick={() => console.log(place.url())}>🔗</Button>
          </title>
        }
        actions={[
          <CircleButton icon="+" onClick={store.createDoc} />,
          <CircleButton icon="- all" onClick={store.deleteAll} />,
          <CircleButton icon="🍻">join</CircleButton>,
        ]}
      >
        <DocPage if={doc} id={doc._id} />
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
