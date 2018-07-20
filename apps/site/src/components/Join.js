import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import sanitize from 'sanitize-html'
import jsonp from 'jsonp'
import * as Constants from '~/constants'

const queryString = query => {
  const esc = encodeURIComponent
  return Object.keys(query)
    .map(k => `${esc(k)}=${k === 'c' ? query[k] : esc(query[k])}`)
    .join('&')
}

const Form = view('form', {
  flex: 1,
  position: 'relative',
})

const Inner = view({
  flexFlow: 'row',
  [Constants.screen.smallQuery]: {
    flexFlow: 'column',
  },
})

const Section = view('section', {
  textAlign: 'left',
  width: '100%',
  maxWidth: 540,
  margin: [0, 'auto'],
})

const Message = view({
  position: 'absolute',
  bottom: -100,
  left: 0,
  right: 0,
  color: 'darkred',
  success: {
    color: 'darkgreen',
  },
})

@attachTheme
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

  render() {
    const { success, error, submitting } = this.state
    const sizeProps = {
      size: 1.2,
      sizeRadius: 1,
      sizePadding: 1.5,
      sizeHeight: 1.1,
    }
    return (
      <Section id="join">
        <Form
          ref={this.form}
          action="https://tryorbit.us18.list-manage.com/subscribe/post?u=019909d3efb283014d35674e5"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          target="_blank"
          noValidate
          onSubmit={this.submit}
        >
          <Inner>
            <UI.Input
              flex={1}
              {...sizeProps}
              ref={this.email}
              type="email"
              name="EMAIL"
              id="mce-EMAIL"
              placeholder="Email address..."
              fontFamily="Eesti Pro"
            />
            <div style={{ height: 20 }} />
            <UI.Theme theme="#37C457">
              <UI.Button
                {...sizeProps}
                fontWeight={500}
                type="submit"
                disabled={submitting}
                fontFamily="Eesti Pro"
                margin={[0, 0, 0, 12]}
                opacity={submitting ? 0.5 : 1}
                pointerEvents={submitting ? 'none' : 'auto'}
              >
                {submitting ? 'Signing up...' : 'Early access'}
              </UI.Button>
            </UI.Theme>
          </Inner>
          <Message
            success={success && !error}
            css={{ maxWidth: '70%', height: 30, marginBottom: -20 }}
            dangerouslySetInnerHTML={{
              __html: sanitize(success || error || ''),
            }}
          />
        </Form>
      </Section>
    )
  }

  // static theme = ({ theme }) => {
  //   // const bg = theme.base.background
  //   // const isLight = bg.isLight()
  //   // const adjust = isLight ? 'darken' : 'lighten'
  //   // const amt = isLight ? 0.1 : 1
  //   return {
  //     input: {
  //       color: theme.base.color,
  //       // WebkitTextFillColor: `${theme.base.color.alpha(0.7)} !important`,
  //     },
  //   }
  // }
}
