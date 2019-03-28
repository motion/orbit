import { gloss, Row, ViewProps } from '@o/gloss'
import React, { Fragment } from 'react'
import { Space } from './Space'

export function SpacedRow({ children, ...props }: ViewProps) {
  const total = React.Children.count(children)
  return (
    <SpacedRowChrome {...props}>
      {React.Children.map(children, (child, index) => (
        <Fragment key={index}>
          {child}
          {index !== total - 1 && <Space />}
        </Fragment>
      ))}
    </SpacedRowChrome>
  )
}

const SpacedRowChrome = gloss(Row, {
  alignItems: 'center',
  padding: 5,
  width: '100%',
})
