import { view, store } from 'helpers'
import App from '../stores/app'
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
                id: {console.log(piece) && piece.url}<br />
                author: {piece.author_id || 'none'}<br />
                content: {piece.title || 'none'}<br />
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
