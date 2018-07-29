import * as React from 'react'

export class StoreHMR extends React.Component {
  state = {
    path: ''
  }

  componentDidMount() {
    this.setState({ path: Math.random() })
  }

  render() {
    return React.cloneElement(this.props.children, { __hmrPath: this.state.path })
  }
}
