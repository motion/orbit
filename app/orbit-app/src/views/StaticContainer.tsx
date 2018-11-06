import * as React from 'react'
import { RECENT_HMR } from '../constants'
import isEqual from 'react-fast-compare'

export class StaticContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const shouldUpdate = !isEqual(this.props.children, nextProps.children) || RECENT_HMR()
    return shouldUpdate
  }

  render() {
    return this.props.children
  }
}
