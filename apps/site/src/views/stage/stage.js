import Animated from 'animated/lib/targets/react-dom'
import { view } from '@mcro/black'

window.Animated = Animated

const animations = {
  first: new Animated.Value(0),
  second: new Animated.Value(0),
  third: new Animated.Value(0),
}

Animated.spring(animations.first, { toValue: 0 }).start()

setTimeout(() => {
  Animated.spring(animations.first, { toValue: 1, speed: 0 }).start()
}, 0)

@view
export class Stage {
  render() {
    return (
      <Animated.div
        style={{
          transform: [{ scale: animations.first }],
          width: 100,
          height: 100,
          background: 'red',
        }}
      >
        Test Div
      </Animated.div>
    )
  }
}
