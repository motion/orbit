import { view, query, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Board from '~/views/place/board'

class PlaceStore {
  place = Place.get(Router.params.slug)
}

@view({
  store: PlaceStore,
})
export default class PlacePage {
  render({ store }) {
    const { place } = store

    return (
      <Page
        header
        title={
          <title if={place} $$flex $$row $$align="center">
            {place.url()}&nbsp;&nbsp;<Button>🔗</Button>
          </title>
        }
        actions={[
          <Button onClick={store.createDoc}>create</Button>,
          <CircleButton $$background="#fff" icon="🍻">join</CircleButton>,
        ]}
      >
        <Board if={place} slug={place.slug} />
      </Page>
    )
  }
}
