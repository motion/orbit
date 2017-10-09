import * as React from 'react'
import * as UI from '@mcro/ui'
import Triangulr from 'triangulr'

export class Pattern extends React.Component {
  static defaultProps = {
    width: 50,
    height: 50,
    size: 50,
    color: 0,
  }
  componentDidMount() {
    this.t = new Triangulr(
      this.props.width,
      this.props.height,
      this.props.size,
      this.props.color
    )
    this.node.appendChild(this.t)
  }
  getNode = x => (this.node = x)
  render() {
    return <node ref={this.getNode} {...this.props} />
  }
}

export const SubTitle = props => (
  <UI.Title
    fontWeight={400}
    color={[0, 0, 0, 0.4]}
    marginBottom={5}
    size={1.1}
    {...props}
  />
)

export const Link = props => (
  <UI.Text fontWeight={400} color="#8b2bec" display="inline" {...props} />
)
