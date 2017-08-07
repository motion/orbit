// @flow
import React from 'react'
import { view } from '@mcro/black'

@view.ui
export default class Grid {
  static defaultProps = {
    columns: 1,
  }

  render({ children, columns, ...props }: Props) {
    if (!children) {
      return null
    }

    return (
      <grid css={{ flexWrap: 'wrap' }} {...props}>
        {React.Children.map(children, (child, index) => {
          return (
            <child key={index}>
              {child}
            </child>
          )
        })}
      </grid>
    )
  }

  static style = {
    grid: {
      justifyContent: 'space-between',
    },
    child: {
      flex: 1,
    },
  }

  static theme = props => ({
    grid: {
      flex: props.flex === true ? 1 : props.flex,
      flexFlow: props.column ? 'column' : 'row',
      ...(props.reverse && {
        flexFlow: props.column ? 'column-reverse' : 'row-reverse',
      }),
    },
    child: {
      width: `${100 / props.columns}%`,
      minWidth: `${100 / props.columns}%`,
      maxWidth: `${100 / props.columns}%`,
    },
  })
}
