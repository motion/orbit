import React from 'react'
import { view, inject } from '@mcro/black'
import { Provider } from 'react-tunnel'

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Form {
  render({ ui, flex, uiContext, ...props }) {
    return (
      <Provider
        provide={{
          uiContext: {
            ...uiContext,
            inForm: true,
          },
        }}
      >
        {() => <form $form {...props} />}
      </Provider>
    )
  }
  static style = {
    form: {
      width: '100%',
    },
  }
}
