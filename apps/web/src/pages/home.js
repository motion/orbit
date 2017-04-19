import App, { Place, Doc } from 'models'
import { view } from 'helpers'
import Router from 'router'
import { Page } from 'views'
import generateName from 'sillyname'

class HomeStore {
  places = Place.all()
  docs = Doc.all()
}

@view.provide({
  store: HomeStore,
})
export default class Home {
  create = e => {
    e.preventDefault()
    Place.collection.insert({
      title: this.place.value,
      author_id: App.user.name,
    })
  }

  createDoc = e => {
    e.preventDefault()
    Doc.create(generateName())
  }

  delete = () =>
    Place.collection.findOne(piece._id).exec().then(doc => doc.remove())

  link = piece => e => {
    e.preventDefault()
    Router.go(piece.url())
  }

  deleteDoc = doc => {
    Doc.collection.findOne(doc._id).exec().then(doc => doc.remove())
  }

  render({ store }) {
    return (
      <Page>
        <Page.Main>
          <docs>
            <doc onClick={this.createDoc}>
              <title>+</title>
            </doc>

            {(store.docs.current || []).map(doc => (
              <doc onClick={() => Router.go(doc.url())} key={doc._id}>
                <title>{doc.title}</title>
                <author>by {doc.author_id}</author>
                <arrow />
              </doc>
            ))}
          </docs>
        </Page.Main>

        <Page.Side>
          <h2>Places</h2>
          <form if={App.user} onSubmit={this.create}>
            <input ref={this.ref('place').set} placeholder="New Place..." />
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
    },
    doc: {
      transition: [
        `transform .2s cubic-bezier(.55,0,.1,1)`,
        `box-shadow .2s cubic-bezier(.55,0,.1,1)`,
      ].join(', '),
      borderRadius: 6,
      border: [1, [0, 0, 0, 0.1]],
      padding: 20,
      paddingBottom: 10,
      margin: [0, 10, 10, 0],
      color: '#333',
      cursor: 'pointer',
      '&:hover': {
        transform: `rotate(-1deg)`,
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
  }
}
