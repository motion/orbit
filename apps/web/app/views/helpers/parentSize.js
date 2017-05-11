import React from 'react'
import resizer from 'element-resize-detector'

const Resize = resizer({ strategy: 'scroll' })

export default Child => {
  class ParentSize extends React.Component {
    state = {
      dimensions: null,
    }

    componentDidMount() {
      Resize.listenTo(this.parent, this.measure)
      this.measure(this.parent)
    }

    measure = parent => {
      if (this.unmounted) {
        return null
      }
      const parentNode = parent || this.parent
      if (!parentNode) {
        console.log('parent-size: No parent node to measure')
        return null
      }
      const { offsetWidth, offsetHeight } = parentNode
      const dimensions = {
        width: offsetWidth,
        height: offsetHeight,
      }
      this.setState({ dimensions })
      return dimensions
    }

    componentWillUnmount() {
      Resize.removeAllListeners(this.parent)
      this.unmounted = true
    }

    setParent = ref => {
      this.parent = ref
    }

    render() {
      const { dimensions } = this.state
      let parentSize

      if (dimensions) {
        // allow re-measurement
        parentSize = this.measure
        // as well as current measurements
        parentSize.height = this.state.dimensions.height
        parentSize.width = this.state.dimensions.width
      }

      return (
        <parent style={{ flex: 1 }} ref={this.setParent}>
          <Child {...this.props} parentSize={parentSize} />
        </parent>
      )
    }
  }

  // inherent properties
  Object.setPrototypeOf(ParentSize.prototype, Child.prototype)

  return ParentSize
}
