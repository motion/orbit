import React from 'react'
import { view, inject } from '@mcro/black'
import { Provider } from 'react-tunnel'
import { object } from 'prop-types'
import Surface from '../surface'

const resolveFormValues = obj =>
  Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: obj[key]() }), {})

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Form {
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
          inForm: true,
          formValues: {},
        },
      },
    }
  }

  render({ uiContext, ...props }) {
    return <FormInner {...props} />
  }
}

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
          // adds a helper to submit forms from below, useful for buttons
          form: {
            submit: () => this.props.onSubmit(this.formValues),
          },
        },
      },
    }
  }

  get formValues() {
    return resolveFormValues(this.context.provided.uiContext.formValues)
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.props.onSubmit) {
      this.props.onSubmit(this.formValues, e)
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
