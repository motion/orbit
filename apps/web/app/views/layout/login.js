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
    email = null
    password = null
    error = false

    finish = async () => {
      this.loggingIn = true
      await User.loginOrSignup(this.email.value, this.password.value)
      this.loggingIn = false
    }

    onSubmit = (event: Event) => {
      event.preventDefault()
      this.finish()
    }

    onEmailKey = (event: Event) => {
      switch (keycode(event)) {
        case 'enter':
          event.preventDefault()
          event.stopPropagation()
          console.log('focus')
          this.password.focus()
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
          if (this.password.value === '') {
          } else {
            this.password.value = ''
          }
      }
    }
  },
})
export default class Login {
  render({ store }) {
    return (
      <login $$draggable>
        <Form if={!User.loggedIn} $$undraggable onSubmit={store.onSubmit}>
          <Segment>
            <Input
              $input
              $error={store.error}
              name="email"
              onKeyDown={store.onEmailKey}
              getRef={store.ref('email').set}
              placeholder="your name..."
            />
            <Input
              $input
              disabled={store.loggingIn}
              name="password"
              type="password"
              placeholder="password"
              onKeyDown={store.onPasswordKey}
              getRef={store.ref('password').set}
            />
            <Button onClick={store.finish}>
              {store.loggingIn ? '⌛' : '✅'}
            </Button>
          </Segment>
        </Form>

        <step if={User.loggedIn}>
          <text>
            hi
            <username $$ellipse> {User.name}</username>
          </text>
          <Popover target={<Button icon="down" />} background openOnHover>
            <List
              width={150}
              items={[
                <List.Item
                  primary={User.name}
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
