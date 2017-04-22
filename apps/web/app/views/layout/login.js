import { view } from '~/helpers'
import App from 'models'
import { Input, Button, Link } from '~/views'

@view
export default class Login {
  prevent = e => e.preventDefault()

  render() {
    return (
      <user $$row>
        <info $$row $$centered if={App.user}>
          <strong>{App.user.name}</strong>
          <a onClick={App.logout}>logout</a>
        </info>

        <form $login if={!App.user} onSubmit={this.prevent}>
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
    )
  }

  static style = {
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
