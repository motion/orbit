import * as React from 'react'
import { view } from '@mcro/black'

@view.ui
export class Select extends React.Component {
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
      theme,
      ...props
    } = this.props

    if (sync) {
      props.value = sync.get()
      props.onChange = e => sync.set(e.target.value)
    }

    return (
      <div $root className={className}>
        <select $select {...props} />
      </div>
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

  static theme = ({ height, width, background, theme }) => ({
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
  })
}
