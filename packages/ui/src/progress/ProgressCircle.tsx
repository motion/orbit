import * as React from 'react'
import { view } from '@mcro/black'
import { Color } from '@mcro/gloss'

type Props = {
  percent: number
  size: number
  lineType: 'butt' | 'square' | 'round'
  backgroundColor: Color
  lineColor: Color
  lineWidth: number
}

@view.ui
export class ProgressCircle extends React.Component<Props> {
  static defaultProps = {
    backgroundColor: [0, 0, 0, 1],
    lineColor: 'green',
    lineWidth: 4,
    size: 25,
    lineType: 'butt',
  }

  render() {
    const {
      lineType,
      backgroundColor,
      lineColor,
      lineWidth,
      size,
      percent,
      ...props
    } = this.props
    const radius = size - lineWidth / 2
    const length = Math.PI * 2 * radius
    const pathString = `
      M ${size},${size} m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `
    const pathStyle = {
      strokeDasharray: `${length}px ${length}px`,
      strokeDashoffset: `${((100 - percent) / 100) * length}px`,
      transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s ease',
    }

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size * 2} ${size * 2}`}
        {...props}
      >
        <path
          d={pathString}
          stroke={`${backgroundColor}`}
          strokeWidth={lineWidth}
          fillOpacity="0"
        />
        <path
          d={pathString}
          strokeLinecap={lineType}
          stroke={`${lineColor}`}
          strokeWidth={lineWidth}
          fillOpacity="0"
          ref="path"
          style={pathStyle}
        />
      </svg>
    )
  }
}
