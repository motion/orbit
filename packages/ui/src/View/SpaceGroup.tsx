import React, { Fragment } from 'react'
import { Space, SpaceProps } from '../Space'

export type SpaceGroupProps = {
  children?: React.ReactNode
  space?: SpaceProps['space']
  spaceAround?: boolean
}

export function SpaceGroup({ children, space, spaceAround }: SpaceGroupProps) {
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
