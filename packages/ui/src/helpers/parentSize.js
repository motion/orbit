import * as React from 'react'
import resizer from 'element-resize-detector'

const Resize = resizer({ strategy: 'scroll' })

export default prop => Child => {
  class ParentSize extends React.PureComponent {
    state = {
      dimensions: null,
    }

    componentWillUnmount() {
      if (this.props[prop]) {
        Resize.removeAllListeners(this.node)
        this.unmounted = true
      }
    }

    measure(parent) {
      if (this.unmounted) {
        return null
      }
      const node = parent || this.node
      if (!node) {
        return null
      }
      const { offsetWidth, offsetHeight } = node
      const dimensions = {
        width: offsetWidth,
        height: offsetHeight,
      }
      // this could be called from outside parentSize, safety
      if (!this.unmounted) {
        this.setState({ dimensions })
      }
      return dimensions
    }

    setParent(ref) {
      if (!this.node && ref) {
        Resize.listenTo(ref, () => this.measure(ref))
        this.measure(ref)
        this.node = ref
      }
    }

    render() {
      const { dimensions } = this.state
      let parentSize

      if (dimensions) {
        parentSize = {
          measure: (...args) => this.measure(...args),
          height: this.state.dimensions.height,
          width: this.state.dimensions.width,
        }
      }

      const { className, style, ...props } = this.props

      return (
        <div
          className={className}
          style={{ ...style, flex: 1 }}
          ref={x => this.setParent(x)}
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
