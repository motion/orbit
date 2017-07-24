// @flow
import React from 'react'
import { view } from '@mcro/black'
import { User } from '~/app'
import * as UI from '@mcro/ui'

@view({
  store: class SignupStep2Store {
    members = [true]

    addMember = () => {
      this.members = [...this.members, true]
    }

    /* remove to show form by default */

    start() {
      User.org = 'hi'
    }

    errors = null

    // wrap to avoid mobx action wrap because validator has weird api
    // helpers = {
    //   validator: schema({
    //     company: string.minlen(2),
    //     name: string.minlen(2),
    //     email: string
    //       .minlen(5)
    //       .match(
    //         /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    //       ),
    //     password: string.minlen(7),
    //   }),
    // }

    @log
    handleSubmit = async fields => {
      User.org = 'done'
      console.log('submit it up')
    }
  },
})
export default class SignupStep2 {
  render({ store }) {
    const fieldProps = {
      row: true,
      placeholderColor: '#444',
      labelStyle: { width: 110 },
      size: 1.2,
    }

    return (
      <inner>
        <UI.Form onSubmit={store.handleSubmit}>
          {store.errors && JSON.stringify(store.errors)}
          <UI.Text size={1.2} color={[0, 0, 0, 0.4]}>
            Setup teams
          </UI.Text>
          <br />
          <team>
            <UI.Input size={1.2} placeholder="Team name" />

            <content>
              <UI.Title size={1}>Members</UI.Title>
              {store.members.map((_, index) =>
                <row key={index}>
                  <UI.Field row>
                    <UI.Segment flex>
                      <UI.Input
                        {...fieldProps}
                        placeholder="Name"
                        name={`name${index}`}
                      />
                      <UI.Input
                        {...fieldProps}
                        placeholder="Email"
                        name={`email${index}`}
                      />
                    </UI.Segment>
                  </UI.Field>
                </row>
              )}
              <UI.Field row alignSelf="flex-end">
                <UI.Button icon="add" onClick={store.addMember}>
                  Add member
                </UI.Button>
              </UI.Field>
            </content>
          </team>
          <space $$height={20} />
          <end $$row $$justify="space-between">
            <UI.Button
              icon="min-ar"
              chromeless
              color={[0, 0, 0, 0.2]}
              theme="rgb(48, 130, 224)"
              alignSelf="flex-end"
              size={1.2}
              onClick={User.logout}
            />
            <UI.Button
              icon="check"
              type="submit"
              theme="rgb(48, 130, 224)"
              alignSelf="flex-end"
              size={1.2}
            >
              Done
            </UI.Button>
          </end>
        </UI.Form>
      </inner>
    )
  }

  static style = {
    team: {
      padding: 10,
      border: [1, [0, 0, 0, 0.1]],
      borderRadius: 10,
    },
    content: {
      marginLeft: 20,
      padding: [10, 0],
    },
  }
}
