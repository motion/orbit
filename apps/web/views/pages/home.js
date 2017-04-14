import { view, store } from 'helpers'
import { App } from 'stores'
import Router from '../router'
import { Place } from 'models'
import { Page } from 'views'

@view
export default class Home {
  create = () => Place.table.insert({
    title: this.place.value,
    author_id: App.user.name,
  })

  componentWillMount() {
    this.places = Place.all().observable
  }

  delete = () =>
    Place.table.findOne(piece._id).exec().then(doc => doc.remove())

  link = piece => e => {
    e.preventDefault()
    Router.go(piece.url())
  }

  render() {
    return (
      <Page>
        <Page.Main>
          <create if={App.user}>
            create new place:
            <input ref={this.ref('place').set} />
            <button onClick={this.create}>create</button>
          </create>

          <places if={this.places.current}>
            {this.places.current.map(piece =>
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
