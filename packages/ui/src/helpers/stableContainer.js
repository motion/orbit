// @flow
import React from 'react'
import { view } from '@mcro/black'

@view
export default class StableContainer extends React.Component {
  props: {
    stableDuration: number,
    children?: React$Element<any>,
  }

  static defaultProps = {
    stableDuration: 500,
  }

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
