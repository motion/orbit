import * as React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import resizer from 'element-resize-detector'

const Resize = resizer({ strategy: 'scroll' })

export default (...props) => Child => {
  class ParentSize extends React.PureComponent {
    state = {
      dimensions: null,
    }

    componentWillUnmount() {
      if (this.node) {
        Resize.removeAllListeners(this.node)
      }
      this.unmounted = true
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
      this.setState({ dimensions })
      return dimensions
    }

    get isActive() {
      return (
        !props ||
        Object.keys(this.props).findIndex(
          key => this.props[key] && props.indexOf(key) > -1
        ) > -1
      )
    }

    setParent(ref) {
      if (!this.node && ref && this.isActive) {
        this.node = ref
        Resize.listenTo(this.node, () => this.measure(this.node))
        this.measure(this.node)
      }
    }

    render() {
      if (!this.isActive) {
        return <Child {...this.props} parentSize={null} />
      }
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

  hoistStatics(ParentSize, Child)

  return ParentSize
}
