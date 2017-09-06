import * as React from 'react'
import resizer from 'element-resize-detector'

const Resize = resizer({ strategy: 'scroll' })

export default prop => Child => {
  class ParentSize extends React.PureComponent {
    state = {
      dimensions: null,
    }

    componentDidMount() {
      if (this.props[prop]) {
        Resize.listenTo(this.parent, this.measure)
        this.measure(this.parent)
      }
    }

    componentWillUnmount() {
      if (this.props[prop]) {
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

      const { className, style, ...props } = this.props

      return (
        <div
          className={className}
          style={{ ...style, height: '100%' }}
          ref={this.setParent}
        >
          <Child {...props} parentSize={parentSize} />
        </div>
      )
    }
  }

  // inherent properties
  Object.setPrototypeOf(ParentSize.prototype, Child.prototype)

  return ParentSize
}
