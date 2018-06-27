import * as React from 'react'
import { view } from '@mcro/black'
import { P } from '~/views'
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
  }

  render({ ...props }, { success, error, submitting }) {
    return (
      <section id="join" {...props}>
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
          <span css={{ fontFamily: '"Eesti Pro"' }}>
            <UI.Row>
              <UI.Input
                $input
                size={1.1}
                sizeRadius={1}
                sizePadding={1.5}
                ref={this.email}
                type="email"
                name="EMAIL"
                id="mce-EMAIL"
                placeholder="Email address..."
              />
              <UI.Theme theme="#37C457">
                <UI.Button
                  size={1.1}
                  sizeRadius={1}
                  sizePadding={1.5}
                  margin={[0, 0, 0, 12]}
                  fontWeight={500}
                  type="submit"
                  disabled={submitting}
                  css={submitting && { opacity: 0.5, pointerEvents: 'none' }}
                >
                  {submitting ? 'Signing up...' : 'Early access'}
                </UI.Button>
              </UI.Theme>
            </UI.Row>
          </span>
          <message
            $success={success && !error}
            css={{ maxWidth: '70%', height: 30, marginBottom: -20 }}
            dangerouslySetInnerHTML={{
              __html: sanitize(success || error || ''),
            }}
          />
        </form>
      </section>
    )
  }

  static style = {
    section: {
      textAlign: 'left',
      minWidth: 300,
      width: '100%',
      maxWidth: 540,
    },
    input: {
      display: 'flex',
      width: '100%',
      flex: 1,
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
    // const bg = theme.base.background
    // const isLight = bg.isLight()
    // const adjust = isLight ? 'darken' : 'lighten'
    // const amt = isLight ? 0.1 : 1
    return {
      input: {
        color: theme.base.color,
        WebkitTextFillColor: `${theme.base.color.alpha(0.7)} !important`,
      },
    }
  }
}
