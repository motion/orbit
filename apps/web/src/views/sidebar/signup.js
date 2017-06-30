// @flow
import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'
import * as UI from '@mcro/ui'

@view
export default class Signup {
  render({ login }) {
    return (
      <signup $$fullscreen if={!User.loggedIn} $$draggable>
        <UI.Theme name="dark" if={!User.loggedIn}>
          <inner $$flex>
            {login}
            <UI.Form $form padding={15}>
              <UI.PassProps
                row
                placeholderColor="#444"
                labelStyle={{ width: 110 }}
              >
                <UI.Field label="Company" placeholder="" />
                <UI.Field label="Name" placeholder="" />
                <UI.Field label="Email" placeholder="" />
                <UI.Field label="Password" placeholder="" />
              </UI.PassProps>
              <space $$height={20} />
              <UI.Button background="green" size={1.5}>
                Signup
              </UI.Button>
            </UI.Form>
          </inner>
        </UI.Theme>
      </signup>
    )
  }

  static style = {
    signup: {
      background: ['radial-gradient(rgba(0,0,0,0.5), #000)'],
      zIndex: 10000000,
    },
    form: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
