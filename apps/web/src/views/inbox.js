import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Inbox {
  render() {
    return (
      <inbox>
        <UI.Title size={4}>Inbox</UI.Title>

        <UI.List
          items={[
            {
              primary: 'Do something really quick',
              secondary: 'Or just do it slowly',
            },
          ]}
        />
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: 20,
    },
  }
}
