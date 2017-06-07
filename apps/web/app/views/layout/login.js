// @flow
import { view } from '@jot/black'
import { User } from '@jot/models'
import React from 'react'
import { keycode } from '~/helpers'
import { Popover, List, Form, Segment, Input, Button, Link } from '~/ui'
import { HEADER_HEIGHT } from '~/constants'

@view({
  store: class LoginStore {
    loggingIn = false
    usernameRef = null
    passwordRef = null
    error = false

    get step() {
      if (!User.user || (User.user && !User.user.name)) return 1
      if (User.tempUser) return 2
      if (User.loggedIn) return 3
    }

    finish = async () => {
      this.loggingIn = true
      await User.loginOrSignup(this.usernameRef.value, this.passwordRef.value)
      this.loggingIn = false
    }

    onSubmit = (event: Event) => {
      event.preventDefault()
      if (this.step === 2) {
        this.finish()
      }
    }

    setUsernameRef = ref => {
      this.usernameRef = ref
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
          event.preventDefault()
          event.stopPropagation()
          console.log('focus')
          this.passwordRef.focus()
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
        <Form if={store.step < 3} $$undraggable onSubmit={store.onSubmit}>
          <Segment>
            <Input
              $input
              $error={store.error}
              name="email"
              onKeyDown={store.onUsernameKey}
              getRef={store.setUsernameRef}
              placeholder="your name..."
            />
            <Input
              $input
              disabled={store.loggingIn}
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
        </Form>

        <step if={store.step === 3}>
          <text>
            hi
            <username $$ellipse> {User.user.name}</username>
          </text>
          <Popover target={<Button icon="down" />} background openOnHover>
            <List
              width={150}
              items={[
                <List.Item
                  primary={User.user.name}
                  after={<Button icon="power" onClick={() => User.logout()} />}
                />,
              ]}
            />
          </Popover>
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
      flex: 1,
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
      pointerEvents: 'none',
      userSelect: 'none',
    },
  }
}
