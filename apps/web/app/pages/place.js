import { view, autorun, observable } from '~/helpers'
import { Place, Doc } from 'models'
import { Text, Page, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Document from '~/views/document'
import Grid from '~/views/grid'

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

    const docs = (store.docs.current || [])
      .map(doc => (
        <DocItem
          slanty
          draggable
          editable
          onClick={store.setActive(doc)}
          doc={doc}
        />
      ))

    return (
      <Page
        if={place}
        header={
          <header>
            <CircleButton $$background="#fff">join</CircleButton>
            <h2>Place: {place.title}</h2>
          </header>
        }
      >
        <main>
          <Grid
            if={docs}
            layout={[
              {
                w: 1,
                h: 1,
                x: 0,
                y: 0,
                i: '0',
                moved: false,
                static: false,
              },
              {
                w: 1,
                h: 1,
                x: 1,
                y: 0,
                i: '1',
                moved: false,
                static: false,
              },
              {
                w: 1,
                h: 1,
                x: 1,
                y: 1,
                i: '2',
                moved: false,
                static: false,
              },
            ]}
            cols={2}
            rowHeight={200}
            items={docs}
          />

          <Document
            if={false && store.activeDocId}
            noSide
            key={store.activeDocId}
            id={store.activeDocId}
          />
        </main>
        <side>
          <button onClick={store.createDoc}>create</button>
        </side>
      </Page>
    )
  }
}
