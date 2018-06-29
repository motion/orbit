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
    const style = { fontFamily: '"Eesti Pro"' }
    const sizeProps = {
      size: 1.2,
      sizeRadius: 1,
      sizePadding: 1.5,
      sizeHeight: 1.1,
    }
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
          <UI.Row>
            <UI.Input
              $input
              flex
              {...sizeProps}
              ref={this.email}
              type="email"
              name="EMAIL"
              id="mce-EMAIL"
              placeholder="Email address..."
              style={style}
              css={{
                // eesti font fix
                padding: [4, 12, 0],
              }}
            />
            <UI.Theme theme="#37C457">
              <UI.Button
                {...sizeProps}
                margin={[0, 0, 0, 12]}
                fontWeight={500}
                type="submit"
                disabled={submitting}
                style={{
                  ...style,
                  ...(submitting && { opacity: 0.5, pointerEvents: 'none' }),
                }}
              >
                {submitting ? 'Signing up...' : 'Early access'}
              </UI.Button>
            </UI.Theme>
          </UI.Row>
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
    form: {
      flex: 1,
      position: 'relative',
    },
    section: {
      textAlign: 'left',
      minWidth: 300,
      width: '100%',
      maxWidth: 540,
      margin: [0, 'auto'],
    },
    input: {
      background: [0, 0, 0, 0.025],
      width: '100%',
      minWidth: 235,
    },
    message: {
      position: 'absolute',
      bottom: -100,
      left: 0,
      right: 0,
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
