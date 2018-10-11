import * as React from 'react'
import { generateOrbital } from './generateOrbital'
import { View } from '@mcro/ui'

type Props = {
  start?: boolean
  draggable?: boolean
  width?: 96
  height?: 96
  type?: 'dodecahedron' | 'isocahedron' | 'sphere'
}

export class Orbital extends React.Component<Props> {
  static defaultProps = {
    width: 96,
    height: 96,
    type: 'dodecahedron',
  }

  canvas = React.createRef<HTMLCanvasElement>()
  orbital: ReturnType<typeof generateOrbital>

  componentDidMount() {
    const canvas = this.canvas.current
    const { width, height } = this.props
    var w = Math.round(width * 0.92)
    var h = Math.round(height * 0.92)
    var minWindowSize = Math.min(w * 4, h * 4)
    var zoom = Math.floor(minWindowSize / w)
    var pixelRatio = window.devicePixelRatio || 1
    zoom *= pixelRatio
    var canvasWidth = (canvas.width = w * zoom)
    var canvasHeight = (canvas.height = h * zoom)
    // set canvas screen size
    if (pixelRatio > 1) {
      canvas.style.width = canvasWidth / pixelRatio + 'px'
      canvas.style.height = canvasHeight / pixelRatio + 'px'
    }

    this.orbital = generateOrbital({
      type: this.props.type,
      canvas,
      canvasWidth,
      canvasHeight,
      zoom,
      w,
      h,
    })

    this.handleUpdate()
  }

  componentDidUpdate() {
    this.handleUpdate()
  }

  handleUpdate() {
    if (this.props.start) {
      this.orbital.start()
    } else {
      this.orbital.pause()
    }
    if (this.props.draggable) {
      this.orbital.setupDrag()
    }
  }

  componentWillUnmount() {
    this.orbital.pause()
    this.canvas.current.parentElement.removeChild(this.canvas.current)
  }

  render() {
    return (
      <View
        width={this.props.width}
        height={this.props.height}
        overflow="hidden"
        transform={{ z: 0 }}
      >
        <canvas ref={this.canvas} />
      </View>
    )
  }
}
