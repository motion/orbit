import * as React from 'react'

export class StoreHMR extends React.Component<{
  children: (any) => React.ReactNode
}> {
  state = {}
  setStateBound = this.setState.bind(this)

  render() {
    return this.props.children({
      setState: this.setStateBound,
      state: this.state,
    })
  }
}
