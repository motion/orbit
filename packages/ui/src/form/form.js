import React from 'react'
import { view, inject } from '@mcro/black'
import { Provider } from 'react-tunnel'
import Surface from '../surface'

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Form {
  render({ uiContext, ...props }) {
    return (
      <Provider
        provide={{
          uiContext: {
            ...uiContext,
            inForm: true,
            form: {
              submit: () =>
                props.onSubmit(log(this.context.uiContext.formValues)),
            },
            formValues: {},
          },
        }}
      >
        {() => <FormInner {...props} />}
      </Provider>
    )
  }
}

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
class FormInner {
  onSubmit = e => {
    e.preventDefault()
    const { formValues } = this.props.uiContext
    if (this.props.onSubmit) {
      this.props.onSubmit(formValues, e)
    }
  }

  render({ uiContext, ...props }) {
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
