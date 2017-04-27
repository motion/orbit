import { view } from '~/helpers'
import { Place, Document } from 'models'
import { Page, Poof, CircleButton, Link, Input } from '~/views'
import DocItem from '~/views/document/item'
import FlipMove from 'react-flip-move'

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
    const docs = (store.docs.current || [])
      .map((doc, i) => <DocItem key={doc._id} slanty editable doc={doc} />)

    return (
      <Page
        header
        title="my docs"
        actions={[
          <CircleButton onClick={store.createDoc}>
            📇
          </CircleButton>,
        ]}
      >
        <FlipMove $$padding={10} $docs duration={300} easing="ease-out">
          {docs}
        </FlipMove>
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
