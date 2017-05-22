import React from 'react'
import { view, keycode } from '~/helpers'
import App from '@jot/models'
import { Segment, Input, Button, Link } from '~/ui'
import { HEADER_HEIGHT } from '~/constants'

// settimeout or it dont focus yo
@view({
  store: class LoginStore {
    loggingIn = false
    usernameRef = null
    passwordRef = null
    error = false

    start() {
      this.watch(() => {
        if (this.step === 2 && this.passwordRef) {
          this.setTimeout(() => {
            this.passwordRef.focus()
          })
        }
      })
    }

    get step() {
      if (!App.user || (App.user && !App.user.name)) return 1
      if (App.tempUser) return 2
      if (App.loggedIn) return 3
    }

    setUsername = () => {
      if (!this.usernameRef.value) {
        this.error = true
      } else {
        App.setUsername(this.usernameRef.value)
        if (this.passwordRef.value) {
          this.finish()
        }
      }
    }

    finish = async () => {
      this.loggingIn = true
      await App.loginOrSignup(App.user.name, this.passwordRef.value)
      this.loggingIn = false
    }

    onSubmit = e => {
      e.preventDefault()
      if (this.step === 2) {
        this.finish()
      }
    }

    setUsernameRef = ref => {
      this.usernameRef = ref
      if (ref) ref.focus()
    }

    setPasswordRef = ref => {
      this.passwordRef = ref
      if (ref) {
        ref.focus()
        window.x = ref
      }
    }

    onUsernameKey = (event: Event) => {
      switch (keycode(event)) {
        case 'enter':
        case 'tab':
          event.preventDefault()
          event.stopPropagation()
          this.setUsername()
      }
    }

    onPasswordKey = (event: Event) => {
      switch (keycode(event)) {
        case 'enter':
          event.preventDefault()
          event.stopPropagation()
          this.finish()
          break
        case 'esc':
          if (this.passwordRef.value === '') {
            event.preventDefault()
            event.stopPropagation()
            App.setUsername(null)
          } else {
            this.passwordRef.value = ''
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
              name="email"
              onKeyDown={store.onUsernameKey}
              getRef={store.setUsernameRef}
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
                disabled={store.loggingIn}
                width={75}
                name="password"
                type="password"
                placeholder="password"
                onKeyDown={store.onPasswordKey}
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
