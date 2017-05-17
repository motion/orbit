import { view, observable } from '~/helpers'
import App from '@jot/models'
import { Segment, Input, Button, Link } from '~/ui'
import { HEADER_HEIGHT } from '~/constants'

// this.finish()
// enter
// tab
// enter
// tab
// enter
// esc
// 9 tab, 13 enter
@view({
  store: class LoginStore {
    loggingIn = false
    passwordRef = null
    username = null
    password = null
    error = false

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
      if (!this.username) {
        this.error = true
      } else {
        App.setUsername(this.username)
        if (this.password) {
          this.finish()
        }
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

    onUsernameKey = (event: Event) => {
      console.log(event.which)

      switch (event.which) {
        case 13:
        case 9:
          event.preventDefault()
          this.setUsername()
      }
    }

    onPasswordKey = (event: Event) => {
      switch (event.which) {
        case 13:
          event.preventDefault()
          store.finish()
          break
        case 18:
          if (this.password === '') {
            event.preventDefault()
            App.setUsername(null)
          }
      }
    }
  },
})
export default class Login {
  render({ store }) {
    return (
      <login $$draggable>
        <form $step={store.step} $$undraggable onSubmit={store.onSubmit}>
          <step $hinted $$hide={store.step !== 1}>
            <hint>
              press tab
            </hint>
            <Input
              $input
              $error={store.error}
              name="username"
              onKeyDown={store.onUsernameKey}
              onChange={e => (store.username = e.target.value)}
              placeholder="your name..."
            />
          </step>

          <step $$hide={store.step !== 2}>
            <info if={App.user} $showingPass={store.step === 2}>
              <icon onClick={App.clearUser}>{'<'}</icon>
              <username $$ellipse>{App.user.name}</username>
            </info>
            <Segment>
              <Input
                $input
                name="password"
                type="password"
                placeholder="password"
                onKeyDown={this.onPasswordKey}
                onChange={e => (store.password = e.target.value)}
                getRef={store.setPasswordRef}
              />
              <Button onClick={store.finish}>
                {store.loggingIn ? '⌛' : '✅'}
              </Button>
            </Segment>
          </step>
        </form>

        <step if={store.step === 3}>
          <text>
            hi,&nbsp;
            <username $$ellipse>{App.user.name}</username>
          </text>
          <Button onClick={() => App.logout()}>👋</Button>
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
      padding: [0, 6],
      alignItems: 'center',
      height: HEADER_HEIGHT,
      position: 'relative',
    },
    error: {
      borderColor: 'red',
      borderSize: 2,
    },
    step: {
      flex: 1,
      flexFlow: 'row',
      width: '100%',
      justifyContent: 'space-between',
      position: 'relative',
    },
    icon: {
      padding: [0, 5, 0, 0],
      opacity: 0.5,
    },
    hinted: {
      alignItems: 'center',
    },
    hint: {
      position: 'absolute',
      right: 5,
      fontSize: 12,
      opacity: 0.4,
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
