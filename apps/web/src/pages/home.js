import App, { Place, Doc } from 'models'
import { view } from 'helpers'
import Router from 'router'
import { Page } from 'views'
import generateName from 'sillyname'
import Docs from './docs'

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

  destroy = doc => {
    Doc.collection.findOne(doc._id).exec().then(doc => doc.remove())
  }

  render({ store }) {
    return (
      <Page>
        <Page.Main>
          <form if={App.user} onSubmit={this.createDoc}>
            <button onClick={this.createDoc}>create new doc</button>
          </form>

          <h2>Docs</h2>
          <docs if={store.docs.current}>
            <Docs
              onSelect={doc => Router.go(doc.url())}
              onDestroy={this.destroy}
              docs={store.docs.current}
            />
          </docs>
        </Page.Main>

        <Page.Side>
          <form if={App.user} onSubmit={this.create}>
            create new place:
            <input ref={this.ref('place').set} />
            <button onClick={this.create}>create</button>
          </form>

          <h2>Places</h2>
          <places if={store.places.current}>
            {store.places.current.map(piece => (
              <piece key={Math.random()}>
                <a href={piece.url()} onClick={this.link(piece)}>
                  {piece.url()}
                </a>
                by {piece.author_id || 'none'}
              </piece>
            ))}
          </places>
        </Page.Side>
      </Page>
    )
  }

  static style = {
    user: {
      width: 200,
    },
    form: {
      padding: [0, 0, 20, 0],
    },
  }
}
