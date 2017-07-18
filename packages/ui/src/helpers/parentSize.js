import React from 'react'
import resizer from 'element-resize-detector'

const Resize = resizer({ strategy: 'scroll' })

export default Child => {
  class ParentSize extends React.Component {
    state = {
      dimensions: null,
    }

    componentDidMount() {
      if (this.props.measure) {
        Resize.listenTo(this.parent, this.measure)
        this.measure(this.parent)
      }
    }

    componentWillUnmount() {
      if (this.props.measure) {
        Resize.removeAllListeners(this.parent)
        this.unmounted = true
      }
    }

    measure = parent => {
      if (this.unmounted) {
        return null
      }
      const parentNode = parent || this.parent
      if (!parentNode) {
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

    setParent = ref => {
      this.parent = ref
    }

    render() {
      const { dimensions } = this.state
      let parentSize

      if (dimensions) {
        parentSize = {
          measure: this.measure,
          height: this.state.dimensions.height,
          width: this.state.dimensions.width,
        }
      }

      const { measure, className, style, ...props } = this.props

      return (
        <parent
          className={className}
          style={{ ...style, height: '100%' }}
          ref={this.setParent}
        >
          <Child {...props} parentSize={parentSize} />
        </parent>
      )
    }
  }

  // inherent properties
  Object.setPrototypeOf(ParentSize.prototype, Child.prototype)

  return ParentSize
}
