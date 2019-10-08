import { ColorLike } from '@o/color'
import { Box, gloss } from 'gloss'
import React from 'react'

export type ProgressBarProps = {
  background?: ColorLike
  color?: ColorLike
  width: number
  percent: number | string
}

export class ProgressBar extends React.Component<ProgressBarProps> {
  static defaultProps = {
    width: 90,
    percent: 0,
  }

  render() {
    const { percent, color, ...props } = this.props
    return (
      <Outer {...props}>
        <Inner percent={percent} color={color} />
      </Outer>
    )
  }
}

const Outer = gloss(Box, {
  height: 6,
  margin: ['auto', 5],
  borderRadius: 100,
  justifyContent: 'center',
}).theme(props => ({
  minWidth: props.width,
  background: props.backgroundStronger,
}))

const Inner = gloss<any>(Box, {
  height: '100%',
  borderRadius: 100,
}).theme(props => ({
  width: `${props.percent}%`,
  background: props.colorHighlight,
}))
