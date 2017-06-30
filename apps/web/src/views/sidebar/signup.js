// @flow
import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'
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
} from '@mcro/ui'

const idFn = _ => _

@view
export default class Signup {
  render() {
    return (
      <login if={!User.loggedIn} $$draggable>
        <UI.Theme name="dark" if={!User.loggedIn}>
          <modal>
            <UI.Form>
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
