import { view, autorun, observable } from '~/helpers'
import { isEqual } from 'lodash'
import { Place, Document } from 'models'
import { Text, Page, Button, CircleButton } from '~/views'
import Router from '~/router'
import DocItem from '~/views/document/item'
import Grid from '~/views/grid'

class PlaceStore {
  @observable activeDocId = null
  place = Place.get(Router.params.name)
  docs = Document.forBoard(Router.params.name)

  createDoc = () => {
    Document.create({ places: [this.place.current.name] })
  }

  setActive = doc => e => {
    this.activeDocId = doc._id
  }

  makePrimary = doc => e => {
    const { current } = this.place
    current.primary_doc_id = doc._id
    current.save()
  }

  updateLayout = layout => {
    if (!isEqual(this.place.current.layout, layout)) {
      this.place.current.layout = layout
      this.place.current.save()
    }
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
        header
        title={
          <title $$row $$align="center">
            {place.url()}&nbsp;&nbsp;<Button>🔗</Button>
          </title>
        }
        header={
          <Page.Head>
            <dix $$flex />
            <actions $$centered>
              <CircleButton $$background="#fff" icon="🍻">cheers</CircleButton>
            </actions>
          </Page.Head>
        }
      >
        <Grid
          if={docs}
          onLayoutChange={store.updateLayout}
          layout={store.place.current.layout}
          cols={2}
          rowHeight={200}
          items={docs}
        />
        <button onClick={store.createDoc}>create</button>
      </Page>
    )
  }
}
