import { view, store } from 'helpers'
import App from '../stores/app'
import { Place } from 'models'

@view
export default class Home {
  create = () => Place.table.insert({
    title: this.place.value,
    author_id: App.user.id
  })

  componentWillMount() {
    this.places = Place.all().observable
  }

  render() {
    console.log(this.places)

    return (
      <home>
        <create>
          create new place:
          <input ref={this.ref('place').set} />
          <button onClick={this.create}>create</button>
        </create>

        <places if={this.places}>
          {this.places.map(piece =>
            <piece key={Math.random()}>
              author: {piece.author || 'none'}<br />
              content: {piece.content || 'none'}<br />
              <button onClick={() => store.delete(piece._id)}>x</button>
            </piece>
          )}
        </places>
      </home>
    )
  }
}
