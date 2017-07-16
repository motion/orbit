// @flow
import React from 'react'
import { view, schema, string } from '@mcro/black'
import { User, Org } from '@mcro/models'
import * as UI from '@mcro/ui'
import Router from '~/router'

@view({
  store: class SignupStep1Store {
    errors = null

    // wrap to avoid mobx action wrap because validator has weird api
    helpers = {
      validator: schema({
        company: string.minlen(2),
        name: string.minlen(2),
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
        await User.signup(fields.email, fields.password)
      } catch (e) {
        this.errors = [{ message: `Error signing up user: ${e.message}` }]
        return
      }

      console.log('created user now')

      try {
        const org = await Org.create({
          title: fields.name,
          admins: [User.id],
          members: [User.id],
        })

        console.log('done signed up', org)

        // ensure they are at home
        Router.go('/')
      } catch (e) {
        console.log('err', e)
        this.errors = [{ message: `Error creating company: ${e.message}` }]
      }

      if (!this.errors) {
        console.log('NICE JOB DUDE')
      }
    }

    play = node => {
      if (node) {
        node.play()
      }
    }
  },
})
export default class SignupStep1 {
  render({ store }) {
    return (
      <inner $$margin="auto">
        <UI.Form
          onSubmit={store.handleSubmit}
          $$draggable
          $$centered
          $form
          padding={15}
          margin="auto"
        >
          {store.errors && JSON.stringify(store.errors)}
          <UI.Title if={false} $$centered>
            Welcome to Jot
          </UI.Title>
          <UI.Text size={1.2} color={[0, 0, 0, 0.4]}>
            Let's get you signed up
          </UI.Text>
          <br />
          <UI.PassProps
            row
            placeholderColor="#444"
            labelStyle={{ width: 110 }}
            size={1.2}
          >
            <UI.Field label="Company" placeholder="" />
            <UI.Field label="Icon">
              {[1, 2, 3, 4, 5].map(i => <UI.Circle marginRight={5} key={i} />)}
            </UI.Field>
            <hr />
            <UI.Field label="Name" placeholder="" />
            <UI.Field label="Email" placeholder="" />
            <UI.Field label="Password" type="password" placeholder="" />
          </UI.PassProps>
          <space $$height={20} />
          <UI.Button
            iconAfter
            icon="arrowri"
            type="submit"
            theme="rgb(48, 130, 224)"
            alignSelf="flex-end"
            size={1.2}
          >
            Signup
          </UI.Button>
        </UI.Form>
      </inner>
    )
  }
}
