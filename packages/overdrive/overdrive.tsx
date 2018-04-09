import * as React from 'react'
import OverdriveElement from './overdriveElement'

export default class Overdrive extends React.Component {
  props: {
    children?: any
    parentElement?: any
  }

  state = {
    naturalChildren: null,
  }

  componentWillMount() {
    this.updateNaturalChildren()
  }

  componentWillReceiveProps() {
    this.updateNaturalChildren()
  }

  childRefs = {}

  updateNaturalChildren = () => {
    this.setState({
      naturalChildren: this.props.children({
        AnimateElement: props =>
          React.cloneElement(props.children, {
            ref: this.collectNaturalChild(props.id),
          }),
      }),
    })
  }

  collectNaturalChild = id => ref => {
    this.childRefs[id] = ref
  }

  getNaturalChild = id => {
    return this.childRefs[id]
  }

  render() {
    console.log('render overdrive')
    return this.state.naturalChildren
    return this.props.children({
      AnimateElement: props => (
        <OverdriveElement
          parentElement={this.props.parentElement}
          naturalChild={this.getNaturalChild(props.id)}
          {...props}
        />
      ),
    })
  }
}
