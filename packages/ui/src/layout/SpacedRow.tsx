import { Row, ViewProps } from '@o/gloss'
import React, { Fragment } from 'react'
import { Space } from './Space'

export function SpacedRow(props: ViewProps) {
  const total = React.Children.count(props.children)
  return (
    <Row alignItems="center" padding={[0, 5]} width="100%">
      {React.Children.map(props.children, (child, index) => (
        <Fragment key={index}>
          {child}
          {index !== total - 1 && <Space />}
        </Fragment>
      ))}
    </Row>
  )
}
