import { view } from '~/helpers'
import App from 'models'
import { Input, Button, Link } from '~/views'

@view
export default class Login {
  prevent = e => e.preventDefault()

  render() {
    return (
      <login>
        <info $$row $$centered if={App.user}>
          <strong>{App.user.name}</strong>
          <a onClick={App.logout}>logout</a>
        </info>

        <form if={!App.user} onSubmit={this.prevent}>
          <legend>signup or login:</legend>
          <div $$row>
            <Input
              $input
              name="username"
              placeholder="username"
              getRef={this.ref('username').set}
            />
            <Input
              $input
              name="password"
              type="password"
              getRef={this.ref('password').set}
            />
          </div>
          <Button
            $$style={{ width: '100%', textAlign: 'center' }}
            onClick={() =>
              App.loginOrSignup(this.username.value, this.password.value)}
          >
            go
          </Button>
        </form>
      </login>
    )
  }

  static style = {
    login: {
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    form: {
      flex: 1,
      padding: [10, 0],
      borderBottom: [1, '#eee'],
    },
    input: {
      width: 'calc(50% - 10px)',
      margin: 5,
    },
    legend: {
      fontSize: 12,
      textTransform: 'uppercase',
      opacity: 0.7,
    },
  }
}
