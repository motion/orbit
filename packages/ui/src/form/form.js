import React from 'react'
import { view, inject } from '@mcro/black'
import { object } from 'prop-types'
import Surface from '../surface'

const resolveFormValues = obj =>
  Object.keys(obj).reduce(
    (acc, key) => ({ ...acc, [key]: obj[key] && obj[key]() }),
    {}
  )

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
    const submit = this.props.onSubmit || (_ => _)

    return {
      provided: {
        ...this.context.provided,
        uiContext: {
          ...this.context.provided.uiContext,
          // adds a helper to submit forms from below, useful for buttons
          form: {
            submit: () => submit(this.formValues),
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
    e.stopPropagation()
    if (this.props.onSubmit) {
      this.props.onSubmit(this.formValues, e)
    }
  }

  onKeyDown = e => {
    if (e.which === 13 && !this.props.preventEnterSubmit) {
      this.onSubmit(e)
    }
  }

  render(props) {
    return (
      <Surface
        background="transparent"
        tagName="form"
        $form
        {...props}
        onKeyDown={this.onKeyDown}
      />
    )
  }

  static style = {
    form: {
      width: '100%',
    },
  }
}
