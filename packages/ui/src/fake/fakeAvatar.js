import * as React from 'react'
import { view } from '@mcro/black'

@view.ui
export class Avatar {
  static defaultProps = {
    size: 75,
  }

  render() {
    const { image, size, theme, ...props } = this.props

    return (
      <avatar {...props}>
        <img src={image} style={{ width: size, height: size }} />
      </avatar>
    )
  }

  static theme = {
    rounded: {
      img: {
        borderRadius: 100,
      },
    },
  }
}
