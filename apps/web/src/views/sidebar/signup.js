// @flow
import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'
import * as UI from '@mcro/ui'

@view
export default class Signup {
  render() {
    return (
      <login if={!User.loggedIn} $$draggable>
        <UI.Theme name="dark" if={!User.loggedIn}>
          <modal>
            <UI.Form padding={10}>
              <UI.PassProps row chromeless placeholderColor="#333">
                <UI.Field label="Name" placeholder="something" />
                <UI.Field label="Email" placeholder="something" />
                <UI.Field label="Password" placeholder="something" />
              </UI.PassProps>
              <UI.Button>Signup</UI.Button>
            </UI.Form>
          </modal>
        </UI.Theme>
      </login>
    )
  }
}
