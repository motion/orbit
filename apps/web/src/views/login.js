import { view, keycode } from '@mcro/black'
import { User } from '@mcro/models'
import React from 'react'
import * as UI from '@mcro/ui'
import { HEADER_HEIGHT } from '~/constants'

@view({
  store: class LoginStore {
    loggingIn = false
    email = null
    password = null
    error = false

    finish = async ({ email, password }) => {
      this.loggingIn = true
      try {
        await User.loginOrSignup(email, password)
      } catch (e) {
        console.error(e)
      }
      this.loggingIn = false
    }

    onSubmit = values => {
      this.finish(values)
    }

    onEmailKey = event => {
      switch (keycode(event)) {
        case 'enter':
          console.log('enter email')
        // event.preventDefault()
        // event.stopPropagation()
        // this.password.focus()
      }
    }

    onPasswordKey = event => {
      switch (keycode(event)) {
        case 'enter':
          console.log('enter enter')
          // event.stopPropagation()
          // this.finish()
          break
        case 'esc':
          if (this.password.value === '') {
          } else {
            this.password.value = ''
          }
      }
    }
  },
})
export default class Login {
  render({ store, ...props }) {
    return (
      <login if={!User.loggedIn} $$draggable {...props}>
        <UI.Form flex $$undraggable onSubmit={store.onSubmit}>
          <UI.Segment>
            <UI.Input
              $error={store.error}
              disabled={store.loggingIn}
              name="email"
              onKeyDown={store.onEmailKey}
              getRef={store.ref('email').set}
              placeholder="Email"
            />
            <UI.Input
              disabled={store.loggingIn}
              name="password"
              type="password"
              placeholder="Password"
              onKeyDown={store.onPasswordKey}
              getRef={store.ref('password').set}
            />
            <UI.Button icon="raft" tooltip="Forgot password?" />
            <UI.Button type="submit" icon={store.loggingIn ? 'time' : 'lock'}>
              {store.loggingIn ? 'Logging in...' : 'Login'}
            </UI.Button>
          </UI.Segment>
        </UI.Form>
      </login>
    )
  }

  static style = {
    login: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: [0, 6],
      height: HEADER_HEIGHT,
      position: 'relative',
    },
    error: {
      borderColor: 'red',
    },
    step: {
      flex: 1,
      flexFlow: 'row',
      width: '100%',
      justifyContent: 'space-between',
      position: 'relative',
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
    button: {
      padding: [3, 8],
      alignItems: 'center',
      justifyContent: 'center',
    },
    loggedIn: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      padding: [5, 15],
      margin: [0, -10, 1],
    },
    team: {
      fontWeight: 200,
      fontSize: 12,
      color: [255, 255, 255, 0.5],
    },
    text: {
      flex: 1,
      padding: [0, 10],
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexFlow: 'row',
      pointerEvents: 'none',
      userSelect: 'none',
      fontSize: 12,
      fontWeight: 300,
    },
  }
}
