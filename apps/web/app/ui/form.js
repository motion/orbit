import { view } from '~/helpers'
import { Provider } from 'react-tunnel'

@view.ui
export default class Form {
  render({ ...props }) {
    const ui = {
      ...this.context.ui,
      inForm: true,
    }

    return (
      <Provider provide={{ ui }}>
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
