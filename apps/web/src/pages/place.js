import { view, autorun } from 'helpers'
import { Place, Doc } from 'models'
import { Title, Text, Page, Link } from 'views'
import Router from 'router'
import DocItem from '~/src/views/doc/item'

class PlaceStore {
  place = Place.get(Router.params.name)
  docs = Doc.forBoard(Router.params.name)
}

@view.provide({
  store: PlaceStore,
})
export default class PlacePage {
  render({ store }) {
    const [active] = store.place.current || []

    return (
      <Page if={active}>
        <Page.Main>
          {active.title}
          <docs if={store.docs.current}>
            {(store.docs.current || [])
              .map(doc => <DocItem key={doc._id} doc={doc} />)}
          </docs>
        </Page.Main>
      </Page>
    )
  }
}
