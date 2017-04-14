import { view } from 'helpers'
import { App } from 'stores'
import Router from '../router'
import { Place } from 'models'
import { Page } from 'views'

class HomeStore {
  places = Place.all()
}

@view.provide({
  store: HomeStore
})
export default class Home {
  create = () => Place.collection.insert({
    title: this.place.value,
    author_id: App.user.name,
  })

  delete = () =>
    Place.collection.findOne(piece._id).exec().then(doc => doc.remove())

  link = piece => e => {
    e.preventDefault()
    Router.go(piece.url())
  }

  render({ store }) {
    return (
      <Page>
        <Page.Main>
          <create if={App.user}>
            create new place:
            <input ref={this.ref('place').set} />
            <button onClick={this.create}>create</button>
          </create>

          <places if={store.places.current}>
            {store.places.current.map(piece =>
              <piece key={Math.random()}>
                <a href={piece.url()} onClick={this.link(piece)}>
                  {piece.url()}
                </a>
                by {piece.author_id || 'none'}
              </piece>
            )}
          </places>
        </Page.Main>
      </Page>
    )
  }

  static style = {
    user: {
      width: 200,
    }
  }
}
