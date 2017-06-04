import { view } from '~/helpers'
import { Provider } from 'react-tunnel'

@view.ui
export default class Form {
  render({ ...props }) {
    return (
      <Provider
        provide={{
          ui: {
            ...this.context.ui,
            form: true,
          },
        }}
      >
        <form {...props} />
      </Provider>
    )
  }

  static style = {
    form: {
      flex: 1,
    },
  }
}
