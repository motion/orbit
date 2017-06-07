import { view, inject } from '@jot/helpers'
import { Provider } from 'react-tunnel'

@inject(context => ({ ui: context.ui }))
@view.ui
export default class Form {
  render({ ui, ...props }) {
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

  static style = {
    form: {
      flex: 1,
    },
  }
}
