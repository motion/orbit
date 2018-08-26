import * as React from 'react'
import { Resizable } from './Resizable'
import { Props as ResizableProps, ResizeCallbackData } from './Resizable'

type State = { width: number; height: number }

// An example use of Resizable.
export class ResizableBox extends React.Component<ResizableProps, State> {
  static defaultProps = {
    handleSize: [20, 20],
  }

  state = {
    width: this.props.width,
    height: this.props.height,
  }

  onResize = (e: React.MouseEvent, data: ResizeCallbackData) => {
    const { size } = data
    if (this.props.onResize) {
      e.persist && e.persist()
      this.setState(
        size,
        () => this.props.onResize && this.props.onResize(e, data),
      )
    } else {
      this.setState(size)
    }
  }

  componentWillReceiveProps(nextProps: ResizableProps) {
    if (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    ) {
      this.setState({
        width: nextProps.width,
        height: nextProps.height,
      })
    }
  }

  render() {
    // Basic wrapper around a Resizable instance.
    // If you use Resizable directly, you are responsible for updating the child component
    // with a new width and height.
    const {
      handleSize,
      onResize,
      onResizeStart,
      onResizeStop,
      draggableOpts,
      minConstraints,
      maxConstraints,
      lockAspectRatio,
      axis,
      width,
      height,
      ...props
    } = this.props
    return (
      <Resizable
        handleSize={handleSize}
        width={this.state.width}
        height={this.state.height}
        onResizeStart={onResizeStart}
        onResize={this.onResize}
        onResizeStop={onResizeStop}
        draggableOpts={draggableOpts}
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        lockAspectRatio={lockAspectRatio}
        axis={axis}
      >
        <div
          style={{
            width: this.state.width + 'px',
            height: this.state.height + 'px',
          }}
          {...props}
        />
      </Resizable>
    )
  }
}
