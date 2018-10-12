import * as React from 'react'
import { onlyUpdateOnChanged } from '../helpers/onlyUpdateOnChanged'

export class StaticContainer extends React.Component {
  shouldComponentUpdate(a, b, c) {
    return onlyUpdateOnChanged.call(this, a, b, c)
  }

  render() {
    return this.props.children
  }
}
