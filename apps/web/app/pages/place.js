import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Board from '~/views/place/board'

@view({
  store: class PlaceStore {
    place = Place.get(Router.params.slug)
    createDoc = () => Document.create({ places: [this.place.slug] })
    deleteAll = () =>
      Document.all()
        .exec()
        .then(docs => docs.map(doc => doc.delete()))
        .then(docs => console.log('deleted', docs))
  },
})
export default class PlacePage {
  render({ store }) {
    const { place } = store
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
        <form onSubmit={store.createDoc}>
          <input $create placeholder="create doc (#tag to tag) (/ to search)" />
        </form>

        <hashtags>
          {`#all #btc #etherium #monero #day-trading #something`
            .split(' ')
            .map(i => <tag key={i}>{i}</tag>)}
        </hashtags>

        <Board if={place} key={place.slug} slug={place.slug} />
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
