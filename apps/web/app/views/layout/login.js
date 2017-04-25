import { view } from '~/helpers'
import App from 'models'
import { Input, Button, Link } from '~/views'

@view
export default class Login {
  prevent = e => e.preventDefault()

  render() {
    return (
      <login>
        <info if={App.loggedIn}>
          <user $$ellipse>{App.user.name}</user>
          <Button onClick={App.logout}>logout</Button>
        </info>

        <form if={!App.loggedIn} onSubmit={this.prevent}>
          <legend>signup or login:</legend>
          <inputs>
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
          </inputs>
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
    inputs: {
      flexFlow: 'row',
      marginBottom: 5,
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
    info: {
      flexFlow: 'row',
      width: '100%',
      padding: [10, 0],
      borderBottom: [1, '#eee'],
      alignItems: 'center',
    },
    user: {
      flex: 1,
      paddingRight: 10,
    },
  }
}
