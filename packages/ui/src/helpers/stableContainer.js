import * as React from 'react'
import { view } from '@mcro/black'

@view
export class StableContainer extends React.Component {
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
    return <container>{this.state.children || null}</container>
  }
}
