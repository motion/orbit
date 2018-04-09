import * as React from 'react'
import OverdriveElement from './overdriveElement'
import { debounce } from 'lodash'

export default class Overdrive extends React.Component {
  props: {
    children?: any
    parentElement?: any
  }

  state = {
    naturalChildren: null,
    hasRenderedNaturally: false,
  }

  componentWillMount() {
    this.updateNaturalChildren()
  }

  componentWillReceiveProps() {
    this.updateNaturalChildren()
  }

  reRenderAfterCollectingChildren = debounce(() => {
    this.setState({ hasRenderedNaturally: true })
  }, 16)

  childPositions = {}

  updateNaturalChildren = () => {
    this.setState({
      hasRenderedNaturally: false,
      naturalChildren: this.props.children({
        AnimateElement: props =>
          React.cloneElement(props.children, {
            ref: this.getNaturalChildRef(props.id),
          }),
      }),
    })
  }

  getPosition = (node, addOffset?: boolean) => {
    const parentRect = this.props.parentElement.getBoundingClientRect()
    const rect = node.getBoundingClientRect()
    const computedStyle = getComputedStyle(node)
    const marginTop = parseInt(computedStyle.marginTop, 10)
    const marginLeft = parseInt(computedStyle.marginLeft, 10)
    return {
      top: rect.top - marginTop - parentRect.top,
      left: rect.left - marginLeft - parentRect.left,
      width: rect.width,
      height: rect.height,
    }
  }

  getNaturalChildRef = id => ref => {
    if (ref) {
      this.childPositions[id] = this.getPosition(ref)
      this.reRenderAfterCollectingChildren()
    }
  }

  naturalChildRef = id => {
    return this.childPositions[id]
  }

  render() {
    console.log(
      'render overdrive',
      this.childPositions,
      this.state.hasRenderedNaturally,
    )
    if (!this.state.hasRenderedNaturally) {
      return this.state.naturalChildren
    }
    return this.props.children({
      AnimateElement: props => (
        <OverdriveElement
          parentElement={this.props.parentElement}
          naturalChild={this.naturalChildRef(props.id)}
          {...props}
        />
      ),
    })
  }
}
