import { view, autorun } from '~/helpers'
import { Place, Doc } from 'models'
import { Text, Page, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/doc/item'
import Document from '~/views/doc/document'

class PlaceStore {
  place = Place.get(Router.params.name)
  docs = Doc.forBoard(Router.params.name)

  createDoc = () => {
    Doc.create({ places: [this.place.current.name] })
  }

  makePrimary = doc => e => {
    const { current } = this.place
    current.primary_doc_id = doc._id
    current.save()
  }
}

@view({
  store: PlaceStore,
})
export default class PlacePage {
  render({ store }) {
    const place = store.place.current

    return (
      <Page if={place}>
        <Page.Main>
          <CircleButton $$background="#fff">join</CircleButton>
          <h2>Place: {place.title}</h2>
          <Document if={place.primary_doc_id} id={place.primary_doc_id} />
        </Page.Main>

        <Page.Side>
          <button onClick={store.createDoc}>create</button>

          <docs if={store.docs.current}>
            {(store.docs.current || []).map(doc => (
              <DocItem
                key={doc._id}
                doc={doc}
                after={
                  <button onClick={store.makePrimary(doc)}>
                    make primary
                  </button>
                }
              />
            ))}
          </docs>
        </Page.Side>
      </Page>
    )
  }
}
