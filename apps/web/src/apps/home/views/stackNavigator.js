// @flow
import { view } from '@mcro/black'

@view
export default class StackNavigator {
  render({ stack, children }) {
    return stack.items.map((stackItem, index) =>
      children({
        stackItem,
        index,
        currentIndex: stack.length - 1,
        navigate: stack.navigate,
      })
    )
  }
}
