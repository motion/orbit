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
      <login $$draggable>
        <Form flex if={!User.loggedIn} $$undraggable onSubmit={idFn}>
          <Segment>
            <Input
              $input
              name="email"
              onKeyDown={idFn}
              getRef={idFn}
              placeholder="Email"
            />
            <Input
              $input
              name="password"
              type="password"
              placeholder="Password"
              onKeyDown={idFn}
              getRef={idFn}
            />
            <Button icon={idFn} onClick={idFn}>
              Signup
            </Button>
          </Segment>
        </Form>
      </login>
    )
  }

  static style = {}
}
