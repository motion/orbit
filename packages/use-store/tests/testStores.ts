import { react } from '@o/automagical'

import { Store } from '../src/Store'

class Test extends Store<{ x: number }> {
  z = 100

  y = react(() => [this.props.x, this.z], ([x, z]) => x + z + 1)

  up() {
    this.z++
  }
}

const test = new Test({
  x: 1,
})

console.log('gets props', test.y === 102)
test.up()
console.log('sets actions', test.y === 103)
