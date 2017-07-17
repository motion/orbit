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

        <header css={{ position: 'absolute', top: 20, zIndex: 10 }}>
          <logo
            css={{
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: -0.25,
              color: '#111',
            }}
          >
            Covfefe
            <span css={{ fontSize: 12, fontWeight: 200, opacity: 0.15 }}>
              moving docs forward
            </span>
          </logo>
        </header>

        <shape
          $$fullscreen
          css={{
            transform: { rotate: '0deg' },
            animation: 'rotate linear 700s infinite',
          }}
        >
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(119, 233, 94))',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(212, 94, 233))',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(233, 194, 94))',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(94, 191, 233))',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

        <shape
          $$fullscreen
          css={{
            transform: {
              rotate: '-50deg',
              animation: 'rotate linear 700s infinite',
            },
          }}
        >
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(119, 233, 94))',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              borderRadius: 120,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(212, 94, 233))',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(233, 194, 94))',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(94, 191, 233))',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

        <shape $$fullscreen css={{ transform: { rotate: '20deg' } }}>
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(119, 233, 94))',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              borderRadius: 120,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(212, 94, 233))',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(233, 194, 94))',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              borderRadius: 20,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(94, 191, 233))',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

        <shape
          $$fullscreen
          css={{
            transform: { rotate: '150deg' },
            animation: 'rotate linear 700s infinite',
          }}
        >
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(119, 233, 94))',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              borderRadius: 120,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(212, 94, 233))',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(233, 194, 94))',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(94, 191, 233))',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

        <shape $$fullscreen css={{ transform: { rotate: '-100deg' } }}>
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(119, 233, 94))',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              borderRadius: 120,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(212, 94, 233))',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(transparent, rgb(233, 194, 94))',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(transparent, rgb(94, 191, 233))',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

        <shape
          $$fullscreen
          css={{
            transform: { rotate: '80deg' },
            animation: 'rotate-backwards linear 500s infinite',
          }}
        >
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(rgb(119, 233, 94), transparent)',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              borderRadius: 120,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(rgb(212, 94, 233), transparent)',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(rgb(233, 194, 94), transparent)',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(rgb(94, 191, 233), transparent)',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

        <shape $$fullscreen css={{ transform: { rotate: '50deg' } }}>
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(rgb(119, 233, 94), transparent)',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              borderRadius: 120,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(rgb(212, 94, 233), transparent)',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(rgb(233, 194, 94), transparent)',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(rgb(94, 191, 233), transparent)',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

        <shape
          $$fullscreen
          css={{
            transform: { rotate: '-70deg' },
            animation: 'rotate linear 1000s infinite',
          }}
        >
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(rgb(119, 233, 94), transparent)',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              borderRadius: 120,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(rgb(212, 94, 233), transparent)',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(rgb(233, 194, 94), transparent)',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(rgb(94, 191, 233), transparent)',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

        <shape
          $$fullscreen
          css={{
            transform: { rotate: '-170deg' },
            animation: 'rotate linear 1000s infinite',
          }}
        >
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(rgb(119, 233, 94), transparent)',
              top: -190,
              left: -120,
              width: 200,
              height: 300,
              borderRadius: 120,
              transform: { rotate: '-50deg' },
              opacity: 0.05,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(rgb(212, 94, 233), transparent)',
              right: -120,
              top: -210,
              width: 400,
              height: 300,
              borderRadius: 180,
              transform: { rotate: '50deg' },
              opacity: 0.04,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              background: 'linear-gradient(rgb(233, 194, 94), transparent)',
              bottom: -290,
              right: '25%',
              width: 400,
              height: 200,
              transform: { rotate: '60deg' },
              opacity: 0.2,
            }}
          />
          <shape
            css={{
              position: 'absolute',
              zIndex: 0,
              background: 'linear-gradient(rgb(94, 191, 233), transparent)',
              left: '50%',
              bottom: -290,
              width: 200,
              height: 300,
              transform: { rotate: '-50deg' },
              opacity: 0.1,
            }}
          />
        </shape>

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
