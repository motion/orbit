import * as React from 'react'
import { view } from '@mcro/black'
// import $ from '@mcro/color'

// type Props = {
//   background?: Color,
//   color?: Color,
//   width: number,
//   percent: number | string,
// }

@view.ui
export class ProgressBar extends React.Component {
  static defaultProps = {
    width: 90,
    percent: 0,
  }

  render() {
    return null
    // const { percent, color, background, theme, ...props } = this.props
    // return (
    //   <div $outer {...props}>
    //     <div $inner $color={color} />
    //   </div>
    // )
  }

  // style = {
  //   outer: {
  //     height: 6,
  //     margin: ['auto', 5],
  //     borderRadius: 100,
  //     justifyContent: 'center',
  //   },
  //   inner: {
  //     height: '100%',
  //     borderRadius: 100,
  //   },
  // }

  // static theme = ({ color, background, theme, width, percent }) => ({
  //   outer: {
  //     minWidth: width,
  //     width,
  //     background:
  //       background || theme.background
  //         ? $(theme.background).darken(0.5)
  //         : '#eee',
  //   },
  //   inner: {
  //     width: `${percent}%`,
  //     background: color || theme.highlightColor,
  //   },
  // })
}
