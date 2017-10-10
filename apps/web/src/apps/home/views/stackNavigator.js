// @flow
import { view } from '@mcro/black'

@view
export default class StackNavigator {
  render({ stack, children }) {
    return stack.lastTwo.map((data, index) =>
      children({
        data,
        index: stack.length - index,
        currentIndex: stack.currentIndex,
        navigate: stack.navigate,
      })
    )
  }
}
