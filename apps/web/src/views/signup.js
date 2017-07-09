// @flow
import React from 'react'
import { view } from '@mcro/black'
import { User } from '@mcro/models'
import * as UI from '@mcro/ui'
import Step1 from './signup/step1'
import Step2 from './signup/step2'
import Login from './login'

@view({
  store: class SignupStore {
    get step() {
      if (!User.loggedIn) {
        return 1
      }
      if (!User.org) {
        return 2
      }
    }
  },
})
export default class Signup {
  render({ store: { step } }) {
    return (
      <signup $$fullscreen $$draggable $$centered>
        <UI.Glint size={3} borderRadius={5} />
        <UI.Glow
          draggable
          color={[255, 255, 255]}
          opacity={0.3}
          full
          blur={80}
          scale={1.2}
          show
          resist={62}
          backdropFilter="contrast(150%) saturation(150%) brightness(150%)"
        />
        <UI.Theme name="clear">
          <centered $$centered>
            <Step1 if={step === 1} />
            <Step2 if={step === 2} />
          </centered>
        </UI.Theme>
        <UI.Theme name="clear" if={!User.loggedIn}>
          <login
            $$row
            $$centered
            css={{
              position: 'absolute',
              bottom: 10,
              right: 0,
              left: 0,
              opacity: 0.5,
              transition: 'opacity ease-in 100ms',
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            Or login to your account:&nbsp;
            <Login />
          </login>
        </UI.Theme>
      </signup>
    )
  }

  static style = {
    signup: {
      background: 'radial-gradient(#eee, #ddd)',
      zIndex: 11,
    },
    centered: {
      padding: 15,
      marginBottom: 40,
      width: '40%',
      minWidth: 300,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}
