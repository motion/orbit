import React, { Fragment } from 'react'
import { Sizes, Space } from './Space'

export type SpaceGroupProps = {
  children?: React.ReactNode
  space?: Sizes
  spaceAround?: boolean
  separator?: React.ReactNode
}

export function SpaceGroup({ children, space, spaceAround, separator }: SpaceGroupProps) {
  if (!space) {
    return <>{children}</>
  }
  const total = React.Children.count(children)
  const spaceElement = separator || <Space size={space} />
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
