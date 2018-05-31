import * as React from 'react'
import { view } from '@mcro/black'
import { P, P2, Callout } from '~/views'
import * as UI from '@mcro/ui'
import * as r2 from '@mcro/r2'

@view
export class Join extends React.Component {
  state = {
    error: null,
    success: null,
  }

  form = React.createRef()

  submit = async e => {
    e.preventDefault()
    try {
      this.setState({ error: null, success: null })
      const form = this.form.current
      const json = new URLSearchParams(new FormData(form)).toString()
      const { result, msg } = await r2.post(form.getAttribute('action'), {
        json,
        mode: 'no-cors',
      }).json
      if (result === 'error') {
        throw msg
      } else {
        this.setState({ error: null, success: `${msg}` })
      }
    } catch (error) {
      this.setState({ error: 'Error submitting, did you enter an email?' })
    }
  }

  render({ ...props }, { success, error }) {
    return (
      <section id="join" {...props}>
        <Callout>
          <P size={2} fontWeight={600} css={{ marginBottom: 5 }}>
            Early access
          </P>
          <P2 alpha={0.7} size={1.2} margin={[5, 0, 10]}>
            We're rolling Orbit into beta. We'll send invites to early signups
            first!
          </P2>
          <form
            ref={this.form}
            action="https://tryorbit.us18.list-manage.com/subscribe/post-json?u=019909d3efb283014d35674e5&amp;id=015e5a3442"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            target="_blank"
            noValidate
            onSubmit={this.submit}
          >
            <input
              type="email"
              name="EMAIL"
              id="mce-EMAIL"
              placeholder="Email address..."
            />
            <div $$hidden aria-hidden="true">
              <input
                type="text"
                name="b_019909d3efb283014d35674e5_015e5a3442"
                tabIndex="-1"
                value=""
              />
            </div>
            <end $$row $$align="center">
              <message
                if={success || error}
                $success={success && !error}
                css={{ maxWidth: '70%' }}
              >
                {success || error || ''}
              </message>
              <UI.Theme theme="rgb(10.8%, 34.7%, 81.2%)">
                <UI.Button
                  size={1.1}
                  sizeRadius={3}
                  margin={[0, 0, 0, 'auto']}
                  type="submit"
                >
                  Signup
                </UI.Button>
              </UI.Theme>
            </end>
          </form>
        </Callout>
      </section>
    )
  }

  static style = {
    section: {
      textAlign: 'left',
      minWidth: 300,
      width: '100%',
      maxWidth: 450,
      margin: [0, 'auto'],
      padding: [5, 10],
    },
    input: {
      display: 'flex',
      width: '100%',
      flex: 1,
      padding: [12, 16],
      margin: [10, 0, 20],
      fontSize: 18,
      border: [1, 'red'],
    },
    message: {
      paddingRight: 40,
      color: 'darkred',
    },
    success: {
      color: 'darkgreen',
    },
  }

  static theme = (props, theme) => {
    const bg = theme.base.background
    const isLight = bg.isLight()
    const adjust = isLight ? 'darken' : 'lighten'
    const amt = isLight ? 0.1 : 1
    return {
      input: {
        color: theme.base.color,
        WebkitTextFillColor: `${theme.base.color.alpha(0.7)} !important`,
        background: bg[adjust](0.3 * amt),
        border: [1, bg[adjust](1.2 * amt)],
      },
    }
  }
}
