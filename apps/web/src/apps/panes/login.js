import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import Signup from './views/signup'

@view({
  store: class LoginStore {
    loggingIn = false
    email = null
    password = null
    error = false

    finish = async ({ email, password }) => {
      this.loggingIn = true
      try {
        await CurrentUser.login(email, password)
      } catch (e) {
        console.error(e)
      }
      this.loggingIn = false
    }
  },
})
export default class BarLoginPane {
  render({ store }) {
    return (
      <UI.Theme name="light">
        <setup>
          <Signup />

          <UI.Title size={2}>Login</UI.Title>
          <UI.Form $$undraggable onSubmit={store.finish}>
            <UI.Row>
              <UI.Input
                $error={store.error}
                disabled={store.loggingIn}
                name="email"
                getRef={store.ref('email').set}
                placeholder="Email"
              />
              <UI.Input
                disabled={store.loggingIn}
                name="password"
                type="password"
                placeholder="Password"
                getRef={store.ref('password').set}
              />
              <UI.Button icon="raft" tooltip="Forgot password?" />
              <UI.Button type="submit" icon={store.loggingIn ? 'time' : 'lock'}>
                {store.loggingIn ? 'Logging in...' : 'Login'}
              </UI.Button>
            </UI.Row>
          </UI.Form>
        </setup>
      </UI.Theme>
    )
  }

  static style = {
    setup: {
      padding: 20,
    },
  }
}
