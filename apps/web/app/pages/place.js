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

    createDoc = () => {
      Document.create({ places: [this.place.slug] })
    }
    deleteAll = () =>
      Document.all()
        .exec()
        .then(docs => docs.map(doc => doc.delete()))
        .then(docs => console.log('deleted', docs))
  },
})
export default class PlacePage {
  render({ store }) {
    const { place, doc } = store

    return (
      <Page
        header={
          <header $$flex $$row $$centered>
            <title if={false && place} $$flex $$row $$align="center">
              {place.url()}&nbsp;&nbsp;<Button>🔗</Button>
            </title>
            <actions $$flex $$row $$centered>
              <CircleButton icon="create" onClick={store.createDoc} />
              <CircleButton icon="delete all" onClick={store.deleteAll} />
            </actions>
            <CircleButton $$background="#fff" icon="🍻">join</CircleButton>,
          </header>
        }
      >
        <DocPage if={doc} noActions id={doc._id} />
        <Board if={false && place} key={place.slug} slug={place.slug} />
      </Page>
    )
  }
}
