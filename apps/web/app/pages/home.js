import { view } from '~/helpers'
import App, { Place, Doc } from 'models'
import FlipMove from 'react-flip-move'
import { Page, Poof, CircleButton, Link } from '~/views'
import DocItem from '~/views/doc/item'
import Grid from '~/views/grid'

class HomeStore {
  places = Place.all()
  docs = Doc.recent()
  place = null
  createdDoc = false

  createDoc = e => {
    e.preventDefault()
    Doc.create()
    this.createdDoc = true
  }

  createPlace = e => {
    e.preventDefault()
    Place.create({
      title: this.place.value,
      author_id: App.user.name,
    })
  }
}

@view({
  store: HomeStore,
})
export default class Home {
  componentDidUpdate() {
    if (this.props.store.createdDoc && this.docRef) {
      this.docRef.focus()
      this.props.store.createdDoc = false
    }
  }

  render({ store }) {
    const docs = (store.docs.current || []).map((doc, i) => (
      <DocItem
        slanty
        editable
        key={doc._id}
        getRef={ref => {
          // todo getRef is hacky workaround until this is fixed:
          // https://github.com/joshwcomeau/react-flip-move/issues/140
          if (i === 0) {
            this.docRef = ref
          }
        }}
        doc={doc}
      />
    ))

    return (
      <Page>
        <Page.Main>
          <CircleButton onClick={store.createDoc}>
            +
          </CircleButton>
          <Grid if={false} items={docs} />
          <FlipMove $docs duration={100} easing="ease-out">
            {docs}
          </FlipMove>
        </Page.Main>

        <Page.Side>
          <h2>Places</h2>
          <form if={App.user} onSubmit={store.createPlace}>
            <input ref={ref => store.place = ref} placeholder="New Place..." />
          </form>
          <places if={store.places.current}>
            {store.places.current.map(piece => (
              <piece key={Math.random()}>
                <Link to={piece.url()}>
                  {piece.url()}
                </Link>
              </piece>
            ))}
          </places>
        </Page.Side>
      </Page>
    )
  }

  static style = {
    docs: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      flex: 1,
      position: 'relative',
    },
    form: {
      padding: [0, 0, 20, 0],
    },
    h2: {
      fontSize: 14,
      color: [0, 0, 0, 0.5],
    },
    piece: {
      fontWeight: 700,
      fontSize: 14,
      color: 'purple',
    },
  }
}
