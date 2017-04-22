import { view, autorun, observable } from '~/helpers'
import { Place, Doc } from 'models'
import { Text, Page, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/doc/item'
import Document from '~/views/doc/document'

class PlaceStore {
  @observable activeDocId = null
  place = Place.get(Router.params.name)
  docs = Doc.forBoard(Router.params.name)

  createDoc = () => {
    Doc.create({ places: [this.place.current.name] })
  }

  setActive = doc => e => {
    this.activeDocId = doc._id
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
        <Page.Main
          header={
            <header>
              <CircleButton $$background="#fff">join</CircleButton>
              <h2>Place: {place.title}</h2>
            </header>
          }
        >
          <Document
            if={store.activeDocId}
            noSide
            key={store.activeDocId}
            id={store.activeDocId}
          />
        </Page.Main>

        <Page.Side>
          <button onClick={store.createDoc}>create</button>

          <h4>documents</h4>
          <docs if={store.docs.current}>
            {(store.docs.current || []).map(doc => (
              <doc key={doc._id} onClick={store.setActive(doc)}>
                {doc.title}
              </doc>
            ))}
          </docs>
        </Page.Side>
      </Page>
    )
  }
}
