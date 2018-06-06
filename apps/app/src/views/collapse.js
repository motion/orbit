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
    console.log('height', this.state)
    return (
      <container css={{ height: !open ? 0 : this.state.height }}>
        <inner ref={this.innerRef} $hidden={!open}>
          {children}
        </inner>
      </container>
    )
  }

  static style = {
    container: {
      overflow: 'hidden',
    },
    inner: {
      transition: 'all 220ms cubic-bezier(0.175, 0.885, 0.320, 1.275)',
      transformOrigin: '0% 0%',
      opacity: 1,
      transform: { y: 0 },
    },
    hidden: {
      transform: { y: 7 },
      opacity: 0,
    },
  }
}

@view
export class Arrow extends React.Component {
  render({ color, open, height, width, size }) {
    return (
      <container css={{ width, height }}>
        <UI.Icon
          color={color || '#fff'}
          name="arrows-1_small-triangle-right"
          size={size || 24}
          $arrow
          $flip={open}
        />
      </container>
    )
  }

  static style = {
    container: {
      // need enough room for the rotation
      // height: 26,
    },
    arrow: {
      transition: 'transform ease-in 100ms',
      marginRight: 3,
    },
    flip: {
      transform: { rotate: '90deg' },
    },
  }
}
