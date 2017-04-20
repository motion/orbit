import { view, autorun } from 'helpers'
import { Place, Doc } from 'models'
import { Text, Page } from 'views'
import Router from 'router'
import DocItem from '~/src/views/doc/item'
import Document from '~/src/views/doc/document'

class PlaceStore {
  place = Place.get(Router.params.name)
  docs = Doc.forBoard(Router.params.name)

  createDoc = () => {
    Doc.create({ places: [this.place.current.name] })
  }
}

@view.provide({
  store: PlaceStore,
})
export default class PlacePage {
  render({ store }) {
    const [place] = store.place.current || []

    return (
      <Page if={place}>
        <Page.Main>
          <h2>Place: {place.title}</h2>
          <Document if={place.primary_doc_id} id={place.primary_doc_id} />
        </Page.Main>

        <Page.Side>
          <button onClick={store.createDoc}>create</button>

          <docs if={store.docs.current}>
            {(store.docs.current || [])
              .map(doc => <DocItem key={doc._id} doc={doc} />)}
          </docs>
        </Page.Side>
      </Page>
    )
  }
}
