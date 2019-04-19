import * as React from 'react'
import { ProgressBar } from './progressBar'
import { ProgressCircle } from './progressCircle'

type Props = {
  percent?: number
  size?: any
  lineType?: any
  type: 'circle' | 'bar'
  backgroundColor?: any
  lineColor?: any
  lineWidth?: any
}

export class Progress extends React.Component<Props> {
  static defaultProps = {
    percent: 100,
    size: 20,
  }

  static Bar = ProgressBar
  static Circle = ProgressCircle

  render() {
    const { type, ...props } = this.props

    if (type === 'circle') {
      return <ProgressCircle {...props} />
    } else if (type === 'bar') {
      return <ProgressBar {...props} />
    }

    throw new Error('Invalid progress type given')
  }
}
