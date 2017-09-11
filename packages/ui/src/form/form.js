import * as React from 'react'
import { view } from '@mcro/black'
import { object } from 'prop-types'
import Surface from '../surface'

const resolveFormValues = obj =>
  Object.keys(obj).reduce(
    (acc, key) => ({ ...acc, [key]: obj[key] && obj[key]() }),
    {}
  )

export default class Form extends React.Component {
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

  render() {
    return <FormInner {...this.props} />
  }
}

@view.ui
class FormInner extends React.Component {
  static defaultProps = {
    onSubmit: _ => _,
  }
  static contextTypes = {
    provided: object,
  }
  static childContextTypes = {
    provided: object,
  }

  getChildContext() {
    const { onSubmit } = this.props
    return {
      provided: {
        ...this.context.provided,
        uiContext: {
          ...this.context.provided.uiContext,
          // adds a helper to submit forms from below, useful for buttons
          form: {
            submit: () => onSubmit(this.formValues),
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
    this.props.onSubmit(this.formValues, e)
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
        onSubmit={this.onSubmit}
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
