// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Bar from './bar'
import Circle from './circle'

type Props = {
  type: 'bar' | 'circle',
}

@view.ui
export default class Progress extends React.Component<Props> {
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
