import * as React from 'react'
import { Spring } from 'react-spring'

export class DurationTrail extends React.Component {
  render() {
    const { children, delay, delays, ms = 50, keys, ...props } = this.props
    return children.map((child, i) => {
      let previousDelays =
        delay + (delays ? delays.slice(0, i).reduce((a, b) => a + b, 0) : 0)
      if (delays && i >= delays.length) {
        const offset = i - delays.length + 1
        console.log('offset', offset)
        previousDelays += ms * offset
      }
      const curDelay = previousDelays + (delays ? delays[i] || ms : ms)
      console.log('curDelay', i, curDelay)
      return (
        <Spring key={keys[i]} {...props} delay={curDelay}>
          {child}
        </Spring>
      )
    })
  }
}
