import { view, observable } from '~/helpers'
import App from 'models'
import { Input, Button, Link } from '~/views'
import { HEADER_HEIGHT } from '~/constants'

@view
export default class Login {
  username = null
  password = null

  prevent = e => e.preventDefault()
  setUsername = () => App.setUsername(this.username)
  finish = () => App.loginOrSignup(this.username, this.password)
  onPassword = node => node.focus()

  render(props) {
    return (
      <login>
        <step if={App.noUser}>
          <form onSubmit={this.prevent}>
            <Input
              $input
              name="username"
              onKeyDown={e => e.which === 13 && this.setUsername()}
              onChange={e => this.username = e.target.value}
              placeholder="pick username"
            />
            <Button if={!App.hasUsername} $button onClick={this.setUsername}>
              ✅
            </Button>
          </form>
        </step>

        <step if={App.tempUser}>
          <form onSubmit={this.prevent}>
            <username $$ellipse>{App.user.name}</username>
            <Input
              $input
              $$width={50}
              name="password"
              type="password"
              placeholder="password"
              onChange={e => this.password = e.target.value}
              getRef={this.onPassword}
            />
            <Button onClick={this.finish}>✅</Button>
          </form>
        </step>

        <step if={App.loggedIn}>
          welcome,
          <username $$ellipse>{App.user.name}</username>
          <Button onClick={App.logout}>👋</Button>
        </step>
      </login>
    )
  }

  static style = {
    login: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexFlow: 'row',

      padding: [0, 10],
      alignItems: 'center',
      height: HEADER_HEIGHT,
      borderBottom: [1, '#eee'],
    },
    step: {
      flex: 1,
      flexFlow: 'row',
      width: '100%',
    },
    form: {
      width: '100%',
      overflow: 'hidden',
      flexFlow: 'row',
      alignItems: 'center',
    },
    input: {
      display: 'flex',
      flex: 1,
      maxWidth: '75%',
      padding: [4, 8],
      fontSize: 14,
      cursor: 'text',
    },
    info: {
      flexFlow: 'row',
      flex: 4,
      alignItems: 'center',
    },
    username: {
      width: 50,
      paddingRight: 10,
      fontWeight: 500,
    },
    button: {
      padding: [3, 8],
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
