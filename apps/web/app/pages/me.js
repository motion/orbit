import { view } from '~/helpers'
import { Document } from 'models'
import { Page, CircleButton } from '~/views'
import App from 'models'
import DocItem from '~/views/document/item'
import Board from '~/views/place/board'

class MeStore {
  createDoc(e) {
    e.preventDefault()
    Document.create({ places: ['ddd'] })
  }
}

@view({
  store: MeStore,
})
export default class MePage {
  render({ store }) {
    if (!App.user) {
      return <null>no user</null>
    }

    return (
      <Page
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
