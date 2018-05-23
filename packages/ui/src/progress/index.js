import * as React from 'react'
import { view } from '@mcro/black'
import { Bar } from './bar'
import { Circle } from './circle'

@view.ui
export class Progress extends React.Component {
  static Bar = Bar
  static Circle = Circle

  render() {
    const { type, ...props } = this.props

    if (type === 'circle') {
      return <Circle {...props} />
    } else if (type === 'bar') {
      return <Bar {...props} />
    }

    throw new Error('Invalid progress type given')
  }
}
