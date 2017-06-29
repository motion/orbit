import React from 'react'
import { view } from '@mcro/black'
import $ from 'color'

@view.ui
export default class View {
  render(props) {
    return <view {...props} />
  }

  static theme = (props, theme, self) => {
    const background =
      props.background || theme.base.background || 'transparent'
    const borderColor = props.borderColor || theme.base.borderColor
    const color = props.color || theme.base.color

    return {
      view: {
        padding: props.padding,
        borderRadius: props.borderRadius,
        borderColor,
        background,
        '&:hover': {
          color: props.hoverColor,
        },
      },
    }
  }
}
