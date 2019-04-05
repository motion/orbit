import React, { Fragment } from 'react'
import { Sizes, Space } from '../Space'

export type SpaceGroupProps = {
  children?: React.ReactNode
  space?: Sizes
  spaceAround?: boolean
}

export function SpaceGroup({ children, space, spaceAround }: SpaceGroupProps) {
  if (!space) {
    return <>{children}</>
  }
  const total = React.Children.count(children)
  const spaceElement = <Space space={space} />
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
