// @flow
import React from 'react'
import { view, schema, string } from '@mcro/black'
// import { User, Org } from '@mcro/models'
import * as UI from '@mcro/ui'

@view({
  store: class SignupStep2Store {
    members = [true]

    addMember = () => {
      this.members = [...this.members, true]
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

    @log handleSubmit = async fields => {}
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
            Setup your team
          </UI.Text>
          <br />

          <content>
            {store.members.map((_, index) =>
              <row key={index}>
                <UI.Field row label={`Member ${index + 1}`}>
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
            <UI.Field row label>
              <UI.Button icon="add" onClick={store.addMember}>
                Add member
              </UI.Button>
            </UI.Field>
          </content>
          <space $$height={20} />
          <UI.Button
            icon="check"
            type="Done"
            theme="rgb(48, 130, 224)"
            alignSelf="flex-end"
            size={1.2}
          >
            Finish
          </UI.Button>
        </UI.Form>
      </inner>
    )
  }

  static style = {
    content: {
      marginLeft: -80,
    },
  }
}
