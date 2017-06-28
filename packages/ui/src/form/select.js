import React from 'react'
import { view } from '@mcro/black'

@view.ui
export default class Select {
  static defaultProps = {
    height: 20,
    width: 100,
  }

  render() {
    const {
      dark,
      width,
      height,
      light,
      className,
      background,
      sync,
      ...props
    } = this.props

    if (sync) {
      props.value = sync.get()
      props.onChange = e => sync.set(e.target.value)
    }

    return (
      <root className={className}>
        <select {...props} />
      </root>
    )
  }

  static style = {
    root: {
      borderRadius: 4,
    },
    select: {
      background: 'transparent',
      border: 'none',
      width: '100%',
      padding: 5,
      marginTop: 1,
    },
  }

  static theme = {
    theme: ({ height, width, background }, theme) => ({
      root: {
        height,
        width,
        background,
      },
      select: {
        ...theme.base,
        background,
        height,
        width,
      },
    }),
  }
}
