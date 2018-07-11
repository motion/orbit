import * as React from 'react'
import { view } from '@mcro/black'
import { object } from 'prop-types'
import { Surface } from '../surface'
import { UIContext } from '../helpers/contexts'

const resolveFormValues = obj =>
  Object.keys(obj).reduce(
    (acc, key) => ({ ...acc, [key]: obj[key] && obj[key]() }),
    {},
  )

@view.ui
class FormPlain extends React.Component {
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

export const Form = () => (
  <UIContext.Provider
    value={{
      inForm: true,
      formValues: {},
    }}
  >
    <FormPlain {...this.props} />
  </UIContext.Provider>
)
