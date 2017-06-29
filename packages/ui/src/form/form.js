import React from 'react'
import { view, inject } from '@mcro/black'
import { Provider } from 'react-tunnel'

@inject(context => ({ segmentContext: context.segmentContext }))
@view.ui
export default class Form {
  render({ ui, flex, ...props }) {
    return (
      <Provider
        provide={{
          ui: {
            ...ui,
            inForm: true,
          },
        }}
      >
        {() => <form {...props} />}
      </Provider>
    )
  }
}
