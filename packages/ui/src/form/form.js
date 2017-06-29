import React from 'react'
import { view, inject } from '@mcro/black'
import { Provider } from 'react-tunnel'

@inject(context => ({ segmentContext: context.segmentContext }))
@view.ui
export default class Form {
  render({ ui, flex, segmentContext, ...props }) {
    return (
      <Provider
        provide={{
          segmentContext: {
            ...segmentContext,
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
