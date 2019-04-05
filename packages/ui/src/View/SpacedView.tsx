import { gloss, Row, RowProps } from '@o/gloss'
import React, { Fragment } from 'react'
import { Space, Spacing } from '../Space'

export type SpacedViewProps = RowProps & {
  spacing?: Spacing
  spaceAround?: boolean
}

export function SpacedView({ children, spacing, spaceAround, ...props }: SpacedViewProps) {
  const total = React.Children.count(children)
  const spaceElement = <Space size={spacing} />
  return (
    <SpacedRowChrome {...props}>
      {spaceAround && spaceElement}
      {React.Children.map(children, (child, index) => (
        <Fragment key={index}>
          {child}
          {index !== total - 1 && spaceElement}
        </Fragment>
      ))}
      {spaceAround && spaceElement}
    </SpacedRowChrome>
  )
}

const SpacedRowChrome = gloss(Row, {
  alignItems: 'center',
  width: '100%',
})
