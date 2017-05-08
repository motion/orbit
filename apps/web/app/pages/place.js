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
        <Board if={place} key={place.slug} slug={place.slug} />
      </Page>
    )
  }
}
