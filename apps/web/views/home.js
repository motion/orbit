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

        <user>
          <info if={App.user}>
            logged in!
            <strong>{App.user.name}</strong>
            <a onClick={App.logout}>logout</a>
          </info>

          <login if={App.user === false}>
            login!
            <input placeholder="username" ref={this.ref('username').set} />
            <input type="password" ref={this.ref('password').set} />
            <button onClick={() => App.login(this.username.value, this.password.value)}>login</button>
          </login>

          <register if={App.user === false}>
            register!
            <input placeholder="username" ref={this.ref('pusername').set} />
            <input type="password" ref={this.ref('ppassword').set} />
            <button onClick={() => App.signup(this.pusername.value, this.ppassword.value)}>register</button>
          </register>
        </user>
      </home>
    )
  }

  static style = {
    user: {
      width: 200,
    }
  }
}
