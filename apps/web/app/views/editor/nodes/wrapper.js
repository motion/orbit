import { view, Shortcuts } from '~/helpers'

class WrapperStore {}

@view({
  store: WrapperStore,
})
export default class Wrapper {
  render({ store, children }) {
    return (
      <div>
        {children}
      </div>
    )
  }

  static style = {}
}
