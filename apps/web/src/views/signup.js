// @flow
import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'
import * as UI from '@mcro/ui'

@view
export default class Signup {
  render() {
    return (
      <signup if={!User.loggedIn} $$fullscreen $$draggable>
        <UI.Glow
          color={[255, 255, 255]}
          opacity={0.3}
          full
          blur={40}
          scale={1.15}
          show
          resist={95}
          backdropFilter="contrast(150%) saturation(150%) brightness(150%)"
        />
        <UI.Theme name="light">
          <inner $$flex>
            <UI.Form $$draggable $$centered $form padding={15} margin="auto">
              <UI.Title $$centered>Welcome to Jot</UI.Title>
              <UI.Text size={1.2} color={[0, 0, 0, 0.4]}>
                Lets get you signed up
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
                  {[1, 2, 3, 4, 5].map(i =>
                    <UI.Circle
                      background="linear-gradient(-20deg, red, yellow)"
                      marginRight={5}
                      key={i}
                    />
                  )}
                </UI.Field>

                <hr />
                <UI.Field label="Name" placeholder="" />
                <UI.Field label="Email" placeholder="" />
                <UI.Field label="Password" placeholder="" />
              </UI.PassProps>
              <space $$height={20} />
              <UI.Button theme="dark" size={1.2}>
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
      background: '#ccc',
      zIndex: 11,
    },
    form: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
