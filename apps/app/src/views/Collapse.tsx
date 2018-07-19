import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export class Body extends React.Component {
  state = {
    height: 0,
  }

  innerRef = React.createRef()

  componentDidMount() {
    console.log('measure', this.innerRef.current)
    this.setState({
      height: this.innerRef.current.clientHeight,
    })
  }

  render({ open, children }) {
    return (
      <div style={{ height: 'auto' /* !open ? 0 : this.state.height */ }}>
        <div ref={this.innerRef} style={{ opacity: open ? 1 : 0 }}>
          {children}
        </div>
      </div>
    )
  }

  // style = {
  //   container: {
  //     overflow: 'hidden',
  //   },
  //   inner: {
  //     transition: 'all 220ms cubic-bezier(0.175, 0.885, 0.320, 1.275)',
  //     transformOrigin: '0% 0%',
  //     opacity: 1,
  //     transform: { y: 0 },
  //   },
  //   hidden: {
  //     transform: { y: 7 },
  //     opacity: 0,
  //   },
  // }
}

@view
export class Arrow extends React.Component {
  render() {
    const { color, open, height, width, size } = this.props
    return (
      <div style={{ width, height }}>
        <UI.Icon
          color={color || '#fff'}
          name="arrows-1_small-triangle-right"
          size={size || 24}
          transition="transform ease-in 100ms"
          marginRight={3}
          transform={
            open && {
              rotate: '90deg',
            }
          }
        />
      </div>
    )
  }
}
