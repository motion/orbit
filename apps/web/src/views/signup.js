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
      <signup if={step === 1} $$fullscreen $$draggable $$centered>
        <UI.Glint size={1.1} borderRadius={5} />
        <UI.Glow
          if={false}
          draggable
          behind
          color={[255, 255, 255]}
          opacity={1}
          full
          blur={80}
          scale={0.8}
          show
          resist={82}
          offsetTop={200}
          backdropFilter="contrast(150%) saturation(150%) brightness(150%)"
        />

        <header
          css={{
            position: 'absolute',
            top: '30%',
            marginTop: -140,
            zIndex: -1,
            background: 'yellow',
            transform: {
              rotate: '-20deg',
              scale: 2,
            },
          }}
        >
          <logo
            css={{
              fontWeight: 800,
              fontSize: '6vh',
              transform: {
                rotate: '20deg',
              },
              letterSpacing: -0.25,
              color: '#111',
            }}
          >
            Jot
          </logo>
        </header>

        <UI.Theme name="clear-light">
          <centered $$centered>
            <Step1 if={step === 1} />
            <Step2 if={step === 2} />
          </centered>
        </UI.Theme>
        <UI.Theme name="clear-light" if={!User.loggedIn}>
          <login
            $$row
            $$centered
            css={{
              position: 'absolute',
              bottom: 10,
              right: 0,
              left: 0,
              opacity: 0.8,
            }}
          >
            Or login:&nbsp;
            <Login />
          </login>
        </UI.Theme>
      </signup>
    )
  }

  static style = {
    signup: {
      background: 'radial-gradient(#fff, #eee)',
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
