import * as React from 'react'
import { DraggableCore } from 'react-draggable'
import { cloneElement } from './cloneElement'

type Axis = 'both' | 'x' | 'y' | 'none'
type State = {
  resizing: boolean
  width: number
  height: number
  slackW: number
  slackH: number
}
type DragCallbackData = {
  node: HTMLElement
  x: number
  y: number
  deltaX: number
  deltaY: number
  lastX: number
  lastY: number
}
export type ResizeCallbackData = {
  node: HTMLElement
  size: { width: number; height: number }
}
export type Props = {
  children: React.ReactElement<any>
  className?: string
  width: number
  height: number
  handleSize?: [number, number]
  lockAspectRatio?: boolean
  axis?: Axis
  minConstraints?: [number, number]
  maxConstraints?: [number, number]
  onResizeStop?: (e: Event, data: ResizeCallbackData) => any
  onResizeStart?: (e: Event, data: ResizeCallbackData) => any
  onResize?: (e: Event, data: ResizeCallbackData) => any
  draggableOpts?: Object
  style?: Object
}

export class Resizable extends React.Component<Props, State> {
  static defaultProps = {
    handleSize: [20, 20],
    lockAspectRatio: false,
    axis: 'both',
    minConstraints: [20, 20],
    maxConstraints: [Infinity, Infinity],
  }

  state: State = {
    resizing: false,
    width: this.props.width,
    height: this.props.height,
    slackW: 0,
    slackH: 0,
  }

  static getDerivedStateFromProps(props, state) {
    // If parent changes height/width, set that in our state.
    if (!state.resizing && (props.width !== state.width || props.height !== state.height)) {
      return {
        width: props.width,
        height: props.height,
      }
    }
  }

  lockAspectRatio(width: number, height: number, aspectRatio: number): [number, number] {
    height = width / aspectRatio
    width = height * aspectRatio
    return [width, height]
  }

  // If you do this, be careful of constraints
  runConstraints(width: number, height: number): [number, number] {
    const [min, max] = [this.props.minConstraints, this.props.maxConstraints]

    if (this.props.lockAspectRatio) {
      const ratio = this.state.width / this.state.height
      height = width / ratio
      width = height * ratio
    }

    if (!min && !max) return [width, height]

    const [oldW, oldH] = [width, height]

    // Add slack to the values used to calculate bound position. This will ensure that if
    // we start removing slack, the element won't react to it right away until it's been
    // completely removed.
    let { slackW, slackH } = this.state
    width += slackW
    height += slackH

    if (min) {
      width = Math.max(min[0], width)
      height = Math.max(min[1], height)
    }
    if (max) {
      width = Math.min(max[0], width)
      height = Math.min(max[1], height)
    }

    // If the numbers changed, we must have introduced some slack. Record it for the next iteration.
    slackW += oldW - width
    slackH += oldH - height
    if (slackW !== this.state.slackW || slackH !== this.state.slackH) {
      this.setState({ slackW, slackH })
    }

    return [width, height]
  }

  /**
   * Wrapper around drag events to provide more useful data.
   *
   * @param  {String} handlerName Handler name to wrap.
   * @return {Function}           Handler function.
   */
  resizeHandler(handlerName: string): any {
    return (e: React.MouseEvent, { node, deltaX, deltaY }: DragCallbackData) => {
      // Axis restrictions
      const canDragX = this.props.axis === 'both' || this.props.axis === 'x'
      const canDragY = this.props.axis === 'both' || this.props.axis === 'y'

      // Update w/h
      let width = this.state.width + (canDragX ? deltaX : 0)
      let height = this.state.height + (canDragY ? deltaY : 0)

      // Early return if no change
      const widthChanged = width !== this.state.width,
        heightChanged = height !== this.state.height
      if (handlerName === 'onResize' && !widthChanged && !heightChanged) return
      ;[width, height] = this.runConstraints(width, height)

      // Set the appropriate state for this handler.
      const newState: Partial<State> = {}
      if (handlerName === 'onResizeStart') {
        newState.resizing = true
      } else if (handlerName === 'onResizeStop') {
        newState.resizing = false
        newState.slackW = newState.slackH = 0
      } else {
        // Early return if no change after constraints
        if (width === this.state.width && height === this.state.height) return
        newState.width = width
        newState.height = height
      }

      const hasCb = typeof this.props[handlerName] === 'function'
      if (hasCb) {
        if (typeof e.persist === 'function') {
          e.persist()
        }
        this.setState(newState as State, () =>
          this.props[handlerName](e, { node, size: { width, height } }),
        )
      } else {
        this.setState(newState as State)
      }
    }
  }

  render() {
    const {
      children,
      draggableOpts,
      width,
      height,
      handleSize,
      lockAspectRatio,
      axis,
      minConstraints,
      maxConstraints,
      onResize,
      onResizeStop,
      onResizeStart,
      ...props
    } = this.props

    const className = props.className ? `${props.className} react-resizable` : 'react-resizable'

    // What we're doing here is getting the child of this element, and cloning it with this element's props.
    // We are then defining its children as:
    // Its original children (resizable's child's children), and
    // A draggable handle.
    return cloneElement(children, {
      ...props,
      className,
      children: [
        children.props.children,
        <DraggableCore
          {...draggableOpts}
          key="resizableHandle"
          onStop={this.resizeHandler('onResizeStop')}
          onStart={this.resizeHandler('onResizeStart')}
          onDrag={this.resizeHandler('onResize')}
        >
          <span className="react-resizable-handle" />
        </DraggableCore>,
      ],
    })
  }
}
