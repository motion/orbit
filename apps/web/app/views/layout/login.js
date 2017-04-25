import { view } from '~/helpers'
import App from 'models'
import { Input, Button, Link } from '~/views'
import { HEADER_HEIGHT } from '~/constants'

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
          <inputs>
            <Input
              $input
              name="username"
              placeholder="pick username"
              getRef={this.ref('username').set}
            />
            <Input
              if={false}
              $input
              name="password"
              type="password"
              getRef={this.ref('password').set}
            />
          </inputs>
          <Button
            $button
            onClick={() =>
              App.loginOrSignup(this.username.value, this.password.value)}
          >
            +
          </Button>
        </form>
      </login>
    )
  }

  static style = {
    login: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: HEADER_HEIGHT,
      borderBottom: [1, '#eee'],
    },
    form: {
      flex: 1,
      flexFlow: 'row',
      alignItems: 'center',
    },
    inputs: {
      flexFlow: 'row',
      marginBottom: 5,
    },
    input: {
      display: 'flex',
      flex: 1,
      padding: [4, 8],
      fontSize: 14,
      cursor: 'text',
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
    button: {
      padding: [0, 8],
      flexShrink: 1,
    },
  }
}
