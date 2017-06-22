// @flow
import { view } from '@jot/black'
import { User } from '@jot/models'
import React from 'react'
import { keycode } from '~/helpers'
import {
  Dropdown,
  Theme,
  Popover,
  List,
  Form,
  Segment,
  Input,
  Button,
  Link,
} from '~/ui'
import { HEADER_HEIGHT } from '~/constants'

@view({
  store: class LoginStore {
    loggingIn = false
    email = null
    password = null
    error = false

    finish = async () => {
      this.loggingIn = true
      try {
        await User.loginOrSignup(this.email.value, this.password.value)
      } catch (e) {
        console.error(e)
      }
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
              disabled={store.loggingIn}
              name="email"
              onKeyDown={store.onEmailKey}
              getRef={store.ref('email').set}
              placeholder="Email"
            />
            <Input
              $input
              disabled={store.loggingIn}
              name="password"
              type="password"
              placeholder="Password"
              onKeyDown={store.onPasswordKey}
              getRef={store.ref('password').set}
            />
            <Button
              icon={store.loggingIn ? 'time' : 'lock'}
              onClick={store.finish}
            >
              Login
            </Button>
          </Segment>
        </Form>

        <step $loggedIn if={User.loggedIn}>
          <start $team $$row $$centered />

          <end $$row $$centered>
            <text>
              <username $$ellipse> {User.name}</username>
            </text>
            <Popover
              distance={10}
              forgiveness={20}
              theme="light"
              target={<Button circular icon="user" />}
              background
              openOnHover
            >
              <Theme name="light">
                <List
                  width={150}
                  items={[
                    <List.Item
                      primary={User.name}
                      after={
                        <Button
                          chromeless
                          icon="power"
                          onClick={() => User.logout()}
                        />
                      }
                    />,
                  ]}
                />
              </Theme>
            </Popover>
          </end>
        </step>
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
    loggedIn: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      padding: [5, 15],
      margin: [0, -10, 5],
      borderBottom: [1, [255, 255, 255, 0.05]],
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
