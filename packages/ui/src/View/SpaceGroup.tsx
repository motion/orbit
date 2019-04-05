import React, { Fragment } from 'react'
import { Space, SpacingProps } from '../Space'

export type SpaceGroupProps = {
  children?: React.ReactNode
  spacing?: SpacingProps['spacing']
  spaceAround?: boolean
}

export function SpaceGroup({ children, spacing, spaceAround }: SpaceGroupProps) {
  const total = React.Children.count(children)
  const spaceElement = <Space spacing={spacing} />
  return (
    <>
      {spaceAround && spaceElement}
      {React.Children.map(children, (child, index) => (
        <Fragment key={index}>
          {child}
          {index !== total - 1 && spaceElement}
        </Fragment>
      ))}
      {spaceAround && spaceElement}
    </>
  )
}
