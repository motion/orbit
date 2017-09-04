// @flow
import * as React from 'react'
import { view } from '@mcro/black'

type Props = {}
type State = {
  children: React$Element<any>,
}

@view
export default class StableContainer extends React.Component<Props, State> {
  static defaultProps: {}

  componentWillMount() {
    this.setState({
      children: this.props.children,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.setNextChildren) {
      clearTimeout(this.setNextChildren)
    }
    if (!nextProps.children) {
      if (!this.props.stableDuration) {
        return
      }
      this.setNextChildren = this.setTimeout(() => {
        this.setState({
          children: nextProps.children,
        })
      }, this.props.stableDuration)
    } else {
      this.setState({ children: nextProps.children })
    }
  }

  render() {
    return (
      <container>
        {this.state.children || null}
      </container>
    )
  }
}
