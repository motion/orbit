// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { schema, string } from '@mcro/model'
import { CurrentUser } from '~/app'
import * as UI from '@mcro/ui'

@view({
  store: class SignupStore {
    errors = null

    // wrap to avoid mobx action wrap because validator has weird api
    helpers = {
      validator: schema({
        email: string
          .minlen(5)
          .match(
            /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
          ),
        password: string.minlen(7),
      }),
    }

    handleSubmit = async fields => {
      console.log('submitting', fields)

      const passes = this.helpers.validator(fields)
      if (!passes) {
        this.errors = this.helpers.validator.errors
        return
      }

      try {
        await CurrentUser.signup(fields.email, fields.password)
      } catch (e) {
        this.errors = [{ message: `Error signing up user: ${e.message}` }]
        return
      }

      if (!this.errors) {
        console.log('NICE JOB DUDE')
      }
    }
  },
})
export default class Signup {
  render({ store }) {
    return (
      <UI.Theme name="light">
        <inner $$margin="auto">
          <UI.Form
            onSubmit={store.handleSubmit}
            $$draggable
            $$centered
            padding={15}
            margin="auto"
          >
            {store.errors && JSON.stringify(store.errors)}
            <br />
            <UI.PassProps
              row
              placeholderColor="#444"
              labelProps={{ css: { width: 110 } }}
              size={1.2}
            >
              <UI.Field label="Email" placeholder="" />
              <UI.Field label="Password" type="password" placeholder="" />
            </UI.PassProps>
            <space css={{ height: 20 }} />
            <UI.Button
              iconAfter
              icon="arrowminri"
              type="submit"
              theme="rgb(113, 97, 172)"
              alignSelf="flex-end"
              size={1.1}
            >
              Signup
            </UI.Button>
          </UI.Form>
        </inner>
      </UI.Theme>
    )
  }
}
