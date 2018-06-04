import * as React from 'react'
import { view } from '@mcro/black'
import { P, P2, Callout } from '~/views'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import jsonp from 'jsonp'

const queryString = query => {
  const esc = encodeURIComponent
  return Object.keys(query)
    .map(k => `${esc(k)}=${k === 'c' ? query[k] : esc(query[k])}`)
    .join('&')
}

@view
export class Join extends React.Component {
  state = {
    error: null,
    success: null,
    submitting: false,
  }

  form = React.createRef()
  email = React.createRef()

  submit = async e => {
    e.preventDefault()
    let error
    let success
    try {
      this.setState({ error: null, success: null, submitting: true })
      const finish = state => {
        this.setState({
          error: null,
          success: null,
          submitting: false,
          ...state,
        })
      }
      const form = this.form.current
      const query = {
        id: '015e5a3442',
        EMAIL: this.email.current.value,
        b_019909d3efb283014d35674e5_015e5a3442: '',
      }
      let url = form.getAttribute('action').replace('/post', '/post-json')
      url = `${url}&${queryString(query)}`
      jsonp(url, { param: 'c' }, (error, data) => {
        if (error) {
          return finish({ error })
        }
        if (data && data.result === 'error') {
          return finish({ error: data.msg })
        }
        return finish({ success: data.msg })
      })
    } catch (err) {
      console.log('errrr', err)
    }
    this.setState({
      error,
      success,
      submitting: false,
    })
  }

  render({ ...props }, { success, error, submitting }) {
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
            action="https://tryorbit.us18.list-manage.com/subscribe/post?u=019909d3efb283014d35674e5"
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            target="_blank"
            noValidate
            onSubmit={this.submit}
          >
            <input
              ref={this.email}
              type="email"
              name="EMAIL"
              id="mce-EMAIL"
              placeholder="Email address..."
            />
            <end $$row>
              <message
                if={success || error}
                $success={success && !error}
                css={{ maxWidth: '70%' }}
                dangerouslySetInnerHTML={{
                  __html: sanitize(success || error || ''),
                }}
              />
              <UI.Theme theme="rgb(10.8%, 34.7%, 81.2%)">
                <UI.Button
                  size={1.1}
                  sizeRadius={3}
                  margin={[0, 0, 0, 'auto']}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Signing up...' : 'Signup'}
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
