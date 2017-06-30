import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Inbox {
  render() {
    return (
      <inbox>
        <UI.Title size={4}>Inbox</UI.Title>
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: 20,
    },
  }
}
