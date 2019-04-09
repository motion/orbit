import React, { Fragment } from 'react'
import { Sizes, Space } from './Space'

export type SpaceGroupProps = {
  children?: React.ReactNode
  space?: Sizes
  spaceAround?: boolean
  separator?: React.ReactNode
}

export function SpaceGroup({ children, space = true, spaceAround, separator }: SpaceGroupProps) {
  const total = React.Children.count(children)
  if (!space || total <= 1) {
    return children as any
  }
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
