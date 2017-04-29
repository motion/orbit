import { view } from '~/helpers'
import { Document } from 'models'
import { Page, CircleButton } from '~/views'
import DocItem from '~/views/document/item'
import Board from '~/views/place/board'

class MeStore {
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
}
