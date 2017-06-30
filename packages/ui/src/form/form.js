import React from 'react'
import { view, inject } from '@mcro/black'
import { Provider } from 'react-tunnel'
import Surface from '../surface'

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Form {
  render({ uiContext, children, ...props }) {
    return (
      <Surface tagName="form" {...props}>
        <Provider
          provide={{
            uiContext: {
              ...uiContext,
              inForm: true,
            },
          }}
        >
          {() =>
            <formChildren>
              {children}
            </formChildren>}
        </Provider>
      </Surface>
    )
  }
  static style = {
    form: {
      width: '100%',
    },
  }
}
