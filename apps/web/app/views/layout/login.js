import { view, observable } from '~/helpers'
import App from 'models'
import { Input, Button, Link } from '~/views'
import { HEADER_HEIGHT } from '~/constants'

// this.finish()
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

    get step() {
      if (!App.user || (App.user && !App.user.name)) return 1
      if (App.tempUser) return 2
      if (App.loggedIn) return 3
    }

    setPasswordRef = ref => {
      if (ref) {
        this.passwordRef = ref
      }
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

    onSubmit = e => {
      e.preventDefault()
      if (this.step === 2) {
        this.finish()
      }
    }
  },
})
export default class Login {
  render({ store }) {
    return (
      <login $$draggable>
        <form $$undraggable if={!App.loggedIn} onSubmit={store.onSubmit}>
          <step if={store.step === 1}>
            <Input
              $input
              name="username"
              onKeyDown={e => e.which === 13 && store.setUsername()}
              onChange={e => (store.username = e.target.value)}
              placeholder="pick username"
            />
            <Button
              if={!App.hasUsername}
              icon="login"
              onClick={store.setUsername}
            />
          </step>

          <step $$hide={store.step !== 2}>
            <info if={App.user} $showingPass={store.step === 2}>
              <icon onClick={App.clearUser}>{'<'}</icon>
              <username $$ellipse>{App.user.name}</username>
            </info>
            <Input
              $input
              $$width={90}
              name="password"
              type="password"
              placeholder="password"
              onKeyDown={e => e.which === 13 && store.finish()}
              onChange={e => (store.password = e.target.value)}
              getRef={store.setPasswordRef}
            />
            <Button onClick={store.finish}>
              {store.loggingIn ? '⌛' : '✅'}
            </Button>
          </step>
        </form>

        <step if={store.step === 3}>
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
