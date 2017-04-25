import { view, observable } from '~/helpers'
import App from 'models'
import { Input, Button, Link } from '~/views'
import { HEADER_HEIGHT } from '~/constants'

@view
export default class Login {
  @observable showPassword = false
  password = null

  prevent = e => e.preventDefault()
  setUsername = () => App.setUsername(this.username.value)
  setShowPassword = val => this.showPassword = val

  componentDidMount() {
    this.react(() => this.showPassword, show => show && this.password.focus())
  }

  render() {
    const finish = () =>
      App.loginOrSignup(this.username.value, this.password.value)

    return (
      <login>
        <info if={App.hasUsername && !this.showPassword}>
          <user $$ellipse>{App.user.name}</user>
        </info>

        <form if={!App.loggedIn} onSubmit={this.prevent}>
          <Input
            $input
            if={!App.hasUsername}
            name="username"
            onKeyDown={e => e.which === 13 && this.setUsername()}
            placeholder="pick username"
            getRef={this.ref('username').set}
          />
          <Button if={!App.hasUsername} $button onClick={this.setUsername}>
            ✅
          </Button>
        </form>

        <form if={App.hasUsername && App.user.temp} onSubmit={this.prevent}>
          <Input
            $$hide={!this.showPassword}
            $input
            name="password"
            type="password"
            getRef={this.ref('password').set}
          />
          <Button
            if={App.hasUsername && App.user.temp}
            $button
            onClick={() => this.setShowPassword(true)}
          >
            {this.showPassword ? '✅' : 'signup'}
          </Button>
        </form>

        <buttons if={App.loggedIn} $$row $$centered>
          <Button onClick={App.logout}>bye</Button>
        </buttons>
      </login>
    )
  }

  static style = {
    login: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexFlow: 'row',
      flex: 1,
      width: '100%',
      padding: [0, 10],
      alignItems: 'center',
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
      alignItems: 'center',
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
      flex: 4,
      alignItems: 'center',
    },
    user: {
      flex: 1,
      paddingRight: 10,
      fontWeight: 500,
    },
    button: {
      padding: [0, 8],
      flexShrink: 1,
    },
  }
}
