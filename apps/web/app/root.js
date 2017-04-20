import { view } from '~/helpers'
import NotFound from '~/pages/notfound'
import Router from '~/router'

@view
export default class Root {
  prevent = e => e.preventDefault()

  render() {
    const CurrentPage = Router.activeView || NotFound

    return (
      <layout $$flex>
        <header $$row $$align="center">
          <h1>pad</h1>
          <nav $$row>
            <a onClick={() => Router.go('/')}>home</a>
            <a onClick={() => Router.go('/projects')}>popular</a>
          </nav>
          <div $$flex />
          <user $$row>
            <info $$row $$centered if={App.user}>
              <strong>{App.user.name}</strong>
              <a onClick={App.logout}>logout</a>
            </info>

            <form if={App.user === false} $userForm onSubmit={this.prevent}>
              login!
              <input
                name="username"
                placeholder="username"
                ref={this.ref('username').set}
              />
              <input
                name="password"
                type="password"
                ref={this.ref('password').set}
              />
              <button
                onClick={() =>
                  App.login(this.username.value, this.password.value)}
              >
                login
              </button>
            </form>

            <form if={App.user === false} onSubmit={this.prevent}>
              register!
              <input placeholder="username" ref={this.ref('pusername').set} />
              <input type="password" ref={this.ref('ppassword').set} />
              <button
                onClick={() =>
                  App.signup(this.pusername.value, this.ppassword.value)}
              >
                register
              </button>
            </form>
          </user>
        </header>

        <CurrentPage key={Router.key} />
      </layout>
    )
  }

  static style = {
    header: {
      padding: [0, 10],
      margin: 0,
      borderBottom: [1, '#f2f2f2'],
    },
    h1: {
      color: 'purple',
      padding: [5, 10],
      fontSize: 20,
    },
    a: {
      padding: [1, 6],
      margin: [0, 3],
      cursor: 'pointer',
      '&:hover': {
        background: '#f2f2f2',
      },
    },
  }
}
