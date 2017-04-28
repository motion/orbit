import { view } from '~/helpers'
import { Document } from 'models'
import { Page, CircleButton } from '~/views'
import DocItem from '~/views/document/item'
import Board from '~/views/place/board'

class MeStore {
  docs = Document.user()

  createDoc = e => {
    e.preventDefault()
    Document.create()
  }
}

@view({
  store: MeStore,
})
export default class MePage {
  render({ store }) {
    const docs = (store.docs || [])
      .map((doc, i) => (
        <DocItem key={doc._id} draggable slanty editable doc={doc} />
      ))

    return (
      <Page
        header
        title="my docs"
        actions={[
          <CircleButton icon="📇" onClick={store.createDoc}>
            new
          </CircleButton>,
        ]}
      >
        <Board slug="ddd" />
      </Page>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      maxHeight: '100%',
      position: 'relative',
    },
  }
}
