import React from 'react'
import { view } from '@mcro/black'

@view
export default class Circle {
  static defaultProps = {
    size: 30,
  }

  render({
    size,
    background,
    children,
    style,
    className,
    onClick,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    ...props
  }) {
    const elProps = {
      style,
      className,
      onClick,
      onFocus,
      onMouseEnter,
      onMouseLeave,
      children,
    }

    return <circle {...elProps} css={props} />
  }

  static style = {
    circle: {
      borderRadius: 1000,
      lineHeight: '1rem',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      color: '#111',
      fontWeight: 400,
      cursor: 'pointer',
      userSelect: 'none',
    },
  }

  static theme = ({ size, background }) => ({
    circle: {
      width: size,
      height: size,
      background,
      borderRadius: size,
    },
  })
}
