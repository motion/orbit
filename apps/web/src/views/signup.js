// @flow
import React from 'react'
import { view } from '@mcro/black'
import { User, Org } from '@mcro/models'
import * as UI from '@mcro/ui'
import Login from './sidebar/login'

@view
export default class Signup {
  handleSubmit = values => {
    console.log('submitting', values)
  }

  play = node => {
    if (node) {
      node.play()
    }
  }

  render() {
    return (
      <signup if={!User.loggedIn} $$fullscreen $$draggable>
        <video
          if={false}
          src="https://cash-f.squarecdn.com/videos/cash_site_loop.mp4"
          playsInline
          ref={this.play}
          muted
          controls="false"
          loop
          css={{
            position: 'absolute',
            top: '-15%',
            left: '-15%',
            right: 0,
            bottom: 0,
            width: '150%',
            alignSelf: 'center',
            opacity: 0.1,
          }}
        />
        <UI.Glow
          color={[255, 255, 255]}
          opacity={0.35}
          full
          blur={40}
          scale={1.125}
          show
          resist={92}
          backdropFilter="contrast(150%) saturation(150%) brightness(150%)"
        />
        <UI.Theme name="clear">
          <inner $$margin="auto">
            <UI.Form
              onSubmit={this.handleSubmit}
              $$draggable
              $$centered
              $form
              padding={15}
              margin="auto"
            >
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

            <UI.Theme name="clear">
              <login
                $$row
                $$centered
                css={{
                  position: 'absolute',
                  bottom: 10,
                  right: 0,
                  left: 0,
                  opacity: 0.5,
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                Or login to your account:&nbsp;
                <Login />
              </login>
            </UI.Theme>
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
