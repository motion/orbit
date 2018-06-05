import * as React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import ReactResizeDetector from 'react-resize-detector'

export const parentSize = (...props) => Child => {
  class ParentSize extends React.PureComponent {
    state = {
      width: null,
      height: null,
      measured: false,
    }

    onResize = (width, height) => {
      this.setState({ width, height, measured: true })
    }

    get isActive() {
      return (
        !props.length ||
        Object.keys(this.props).findIndex(
          key => this.props[key] && props.indexOf(key) > -1,
        ) > -1
      )
    }

    render() {
      if (!this.isActive) {
        return <Child {...this.props} parentSize={null} />
      }
      const { width, height, measured } = this.state
      return (
        <>
          <ReactResizeDetector
            handleWidth
            handleHeight
            onResize={this.onResize}
          />
          <Child
            {...this.props}
            parentSize={measured ? { width, height } : null}
          />
        </>
      )
    }
  }
  hoistStatics(ParentSize, Child)
  return ParentSize
}
