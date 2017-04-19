import App, { Place, Doc } from 'models'
import { view } from 'helpers'
import Router from 'router'
import { Page, Poof } from 'views'
import generateName from 'sillyname'
import FlipMove from 'react-flip-move'

class HomeStore {
  places = Place.all()
  docs = Doc.recent()
  place = null

  createDoc = e => {
    e.preventDefault()
    Doc.create({ title: generateName() })
  }

  createPlace = e => {
    e.preventDefault()
    Place.create({
      title: this.place.value,
      author_id: App.user.name,
    })
  }
}

@view.provide({
  store: HomeStore,
})
export default class Home {
  link = piece => e => {
    e.preventDefault()
    Router.go(piece.url())
  }

  render({ store }) {
    return (
      <Page>
        <Page.Main>
          <docs>
            <FlipMove $docs duration={100} easing="ease-out">
              <doc onClick={store.createDoc}>
                <title>+</title>
              </doc>
              {(store.docs.current || []).map(doc => {
                let poof
                return (
                  <doc onClick={() => Router.go(doc.url())} key={doc._id}>
                    <title>{doc.title}</title>
                    <author>by {doc.author_id}</author>
                    <delete
                      onClick={async e => {
                        e.stopPropagation()
                        poof.puff()
                        doc.delete()
                      }}
                    >
                      x
                      <Poof ref={ref => poof = ref} />
                    </delete>
                  </doc>
                )
              })}
            </FlipMove>
          </docs>
        </Page.Main>

        <Page.Side>
          <h2>Places</h2>
          <form if={App.user} onSubmit={store.createPlace}>
            <input ref={ref => store.place = ref} placeholder="New Place..." />
          </form>
          <places if={store.places.current}>
            {store.places.current.map(piece => (
              <piece key={Math.random()}>
                <a href={piece.url()} onClick={this.link(piece)}>
                  {piece.url()}
                </a>
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
    },
    doc: {
      position: 'relative',
      borderRadius: 6,
      border: [1, [0, 0, 0, 0.1]],
      padding: 20,
      paddingBottom: 10,
      margin: [0, 10, 10, 0],
      color: '#333',
      cursor: 'pointer',
      '&:hover': {
        transform: {
          rotate: `-1deg`,
          scale: `1.01`,
        },
        // boxShadow: 'inset 0 0 1px #000',
        borderColor: [0, 0, 0, 0.2],
      },
    },
    author: {
      alignSelf: 'right',
      width: '100%',
    },
    title: {
      fontSize: 26,
      fontWeight: 500,
    },
    user: {
      width: 200,
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
    delete: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 16,
      width: 16,
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 20,
      fontSize: 12,
      color: [0, 0, 0, 0.35],
      borderRadius: 1000,
      '&:hover': {
        background: '#eee',
      },
    },
  }
}
