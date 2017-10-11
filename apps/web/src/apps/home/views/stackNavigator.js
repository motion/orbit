// @flow
import { view } from '@mcro/black'

@view
export default class StackNavigator {
  render({ stack, children }) {
    const { length } = stack
    return stack.lastTwo.map((stackItem, index) =>
      children({
        stackItem,
        index: length - index - 1,
        currentIndex: stackItem.col,
        navigate: stack.navigate,
      })
    )
  }
}
