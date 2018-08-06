import * as React from 'react'

export class StoreHMR extends React.Component {
  props: { children: any }

  state = {
    path: Math.random(),
  }

  render() {
    return React.cloneElement(this.props.children, {
      __hmrPath: this.state.path,
    })
  }
}
