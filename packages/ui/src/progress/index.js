import * as React from 'react'
import { view } from '@mcro/black'
import { ProgressBar } from './progressBar'
import { ProgressCircle } from './progressCircle'

@view.ui
export class Progress extends React.Component {
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
