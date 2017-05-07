import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Board from '~/views/place/board'

@view({
  store: class {
    place = Place.get(Router.params.slug)
    createDoc = () => Document.create({ places: [this.place.slug] })
  },
})
export default class PlacePage {
  render({ store }) {
    const { place } = store

    return (
      <Page
        header={
          <header $$flex $$row $$centered>
            <title if={false && place} $$flex $$row $$align="center">
              {place.url()}&nbsp;&nbsp;<Button>🔗</Button>
            </title>
            <actions $$flex $$row $$centered>
              <CircleButton icon="create" onClick={store.createDoc} />,
            </actions>
            <CircleButton $$background="#fff" icon="🍻">join</CircleButton>,
          </header>
        }
      >
        <Board if={place} key={place.slug} slug={place.slug} />
      </Page>
    )
  }
}
