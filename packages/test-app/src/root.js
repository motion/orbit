import * as React from 'react'
import { view, react } from '@mcro/black'

@view.attach({
  store: class MyStore {
    x = 0

    name = react(
      () => [this.props.value, this.x],
      async ([val, x], { sleep }) => {
        if (x % 2 === 0) {
          await sleep(1000)
        }
        if (x % 5 === 0) {
          throw react.cancel
        }
        return `${val} -- ${x}`
      },
    )

    increment = () => {
      this.x++
    }
  },
})
@view
class Counter extends React.Component {
  render({ store }) {
    return (
      <root css={{ pointerEvents: 'all' }}>
        <div>my name is {store.name}</div>
        <button onClick={store.increment}>up</button>
      </root>
    )
  }
}

export class Root extends React.Component {
  state = {
    value: '',
  }

  render() {
    return (
      <div css={{ pointerEvents: 'all' }}>
        <input onChange={e => this.setState({ value: e.target.value })} />
        <Counter value={this.state.value} />
      </div>
    )
  }
}
