import { view, observable } from '~/helpers'
import App from 'models'
import { Input, Button, Link } from '~/views'
import { HEADER_HEIGHT } from '~/constants'

@view({
  store: class {
    loggingIn = false
    passwordRef = null
    username = null
    password = null

    start() {
      this.watch(() => {
        if (App.tempUser && this.passwordRef) {
          this.passwordRef.focus()
        }
      })
    }

    setUsername = () => {
      App.setUsername(this.username)
      if (this.password) {
        this.finish()
      }
    }

    finish = () => {
      this.loggingIn = true
      App.loginOrSignup(App.user.name, this.password)
      this.loggingIn = false
    }
  },
})
export default class Login {
  prevent = e => e.preventDefault()

  render({ store }) {
    const step2 = App.tempUser

    return (
      <login $$draggable>
        <form $$undraggable if={!App.loggedIn} onSubmit={this.prevent}>
          <step if={App.noUser}>
            <Input
              $input
              name="username"
              onKeyDown={e => e.which === 13 && store.setUsername()}
              onChange={e => (store.username = e.target.value)}
              placeholder="pick username"
            />
            <Button if={!App.hasUsername} $button onClick={store.setUsername}>
              ✅
            </Button>
          </step>

          <step $$hide={!step2}>
            <info if={App.user} $showingPass={step2}>
              <icon onClick={App.clearUser}>{'<'}</icon>
              <username $$ellipse>{App.user.name}</username>
            </info>
            <Input
              $input
              $$width={100}
              name="password"
              type="password"
              placeholder="password"
              onKeyDown={e => e.which === 13 && store.finish()}
              onChange={e => (store.password = e.target.value)}
              getRef={ref => (store.passwordRef = ref)}
            />
            <Button onClick={store.finish}>
              {store.loggingIn ? '⌛' : '✅'}
            </Button>
          </step>
        </form>

        <step if={App.loggedIn}>
          <text>
            hi,&nbsp;
            <username $$ellipse>{App.user.name}</username>
          </text>
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
      justifyContent: 'space-between',
    },
    icon: {
      padding: [0, 5, 0, 0],
      opacity: 0.5,
    },
    form: {
      width: '100%',
      overflow: 'hidden',
      flexFlow: 'row',
      alignItems: 'center',
    },
    showingPass: {
      width: '25%',
    },
    input: {
      display: 'flex',
      flex: 1,
      maxWidth: '75%',
      padding: [4, 8],
      fontSize: 14,
    },
    info: {
      flexFlow: 'row',
      flex: 4,
      alignItems: 'center',
    },
    username: {
      maxWidth: '80%',
      paddingRight: 10,
      fontWeight: 500,
    },
    button: {
      padding: [3, 8],
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      flex: 1,
      maxWidth: '80%',
      alignItems: 'center',
      flexFlow: 'row',
      userSelect: 'none',
    },
  }
}
