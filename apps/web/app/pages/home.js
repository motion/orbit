import { view } from '~/helpers'
import { Place, Doc } from 'models'
import FlipMove from 'react-flip-move'
import { Page, CircleButton } from '~/views'
import DocItem from '~/views/document/item'

class HomeStore {
  docs = Doc.recent()
  place = null

  createDoc = e => {
    e.preventDefault()
    Doc.create()
  }

  createPlace = e => {
    e.preventDefault()
    Place.create({
      title: this.place.value,
      authorId: App.user.name,
    })
  }
}

@view({
  store: HomeStore,
})
export default class Home {
  render({ store }) {
    const docs = (store.docs.current || [])
      .map((doc, i) => <DocItem key={doc._id} slanty editable doc={doc} />)

    return (
      <Page
        header
        title="Home"
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
