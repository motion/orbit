import { view } from '~/helpers'
import { Input, Button, Link } from '~/views'
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
            <Link $link onClick={() => Router.go('/')}>home</Link>
            <Link $link onClick={() => Router.go('/projects')}>popular</Link>
          </nav>
          <div $$flex />
          <user $$row>
            <info $$row $$centered if={App.user}>
              <strong>{App.user.name}</strong>
              <a onClick={App.logout}>logout</a>
            </info>

            <form $login if={App.user === false} onSubmit={this.prevent}>
              signup or login:
              <Input
                name="username"
                placeholder="username"
                getRef={this.ref('username').set}
              />
              <Input
                name="password"
                type="password"
                getRef={this.ref('password').set}
              />
              <Button
                onClick={() =>
                  App.loginOrSignup(this.username.value, this.password.value)}
              >
                go
              </Button>
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
    link: {
      padding: [1, 6],
      margin: [0, 3],
      '&:hover': {
        background: '#f2f2f2',
      },
    },
    login: {
      flexFlow: 'row',
      flex: 1,
      whiteSpace: 'norwap',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    user: {
      flex: 4,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  }
}
