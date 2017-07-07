import React from 'react'
import { view, inject } from '@mcro/black'
import { Provider } from 'react-tunnel'
import { object } from 'prop-types'
import Surface from '../surface'

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Form {
  child = null

  submit = values => {
    if (this.props.onSubmit) {
      console.log('SUBMIT AY', this.child)
      this.props.onSubmit(values || this.child.formValues())
    }
  }

  render({ uiContext, ...props }) {
    return (
      <Provider
        provide={{
          uiContext: {
            ...uiContext,
            inForm: true,
            formValues: {},
          },
        }}
      >
        {() =>
          <FormInner
            ref={ref => (this.child = ref)}
            onSubmit={this.submit}
            {...props}
          />}
      </Provider>
    )
  }
}

// @inject(context => ({ uiContext: context.uiContext }))
@view.ui
class FormInner extends React.Component {
  static contextTypes = {
    provided: object,
  }

  static childContextTypes = {
    provided: object,
  }

  getChildContext() {
    return {
      provided: {
        ...this.context.provided,
        uiContext: {
          ...this.context.provided.uiContext,
          form: {
            submit: () => this.props.onSubmit(this.context.provided.formValues),
          },
        },
      },
    }
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.props.onSubmit) {
      log('ONSUBMIT YEA')
      this.props.onSubmit(this.context.uiContext.formValues, e)
    }
  }

  render(props) {
    return (
      <Surface
        background="transparent"
        tagName="form"
        $form
        {...props}
        onSubmit={this.onSubmit}
      />
    )
  }

  static style = {
    form: {
      width: '100%',
    },
  }
}
