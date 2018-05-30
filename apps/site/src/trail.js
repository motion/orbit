import * as React from 'react'
import { Spring } from 'react-spring'

export class DurationTrail extends React.Component {
  render() {
    const { children, delay, ms = 50, keys, ...props } = this.props
    return children.map((child, i) => {
      return (
        <Spring key={keys[i]} {...props} delay={delay + i * ms}>
          {child}
        </Spring>
      )
    })
  }
}
