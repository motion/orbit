import React from 'react'
import { view } from '@jot/black'
import { inject } from '/helpers'
import { Provider } from 'react-tunnel'

@inject(context => ({ ui: context.ui }))
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

  static theme = {
    flex: {
      form: {
        flex: 1,
      },
    },
  }
}
