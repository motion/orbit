import { selectDefined } from '@o/utils'
import React, { cloneElement, Fragment } from 'react'
import { Sizes, Space } from './Space'

export type SpaceGroupProps = {
  children?: React.ReactNode
  space?: Sizes
  spaceAround?: boolean
  separator?: React.ReactNode
  beforeSpace?: React.ReactNode
  afterSpace?: React.ReactNode
}

const childrenToArr = (x: React.ReactNode): JSX.Element[] => React.Children.map(x, _ => _) as any

export function SpaceGroup({
  children,
  space = true,
  spaceAround,
  separator,
  beforeSpace,
  afterSpace,
}: SpaceGroupProps) {
  if (!children) {
    return null
  }
  let childs = childrenToArr(children)
  let total = childs.length

  // Allows special cases for unwrapping/forwarding spacing
  if (total === 1) {
    const child = childs[0]
    const type = child.type
    // unwrap fragments and children with `canUnwrap`!
    if (type === React.Fragment || type.canUnwrap) {
      if (!child.props.children) {
        return null
      }
      childs = childrenToArr(child.props.children)
      total = childs.length
    }
    // not sure if this is a great feature, could be really confusing...
    // basically makes it really easy to change the Row/Col direction without losing spacing
    if (type && type.acceptsSpacing && selectDefined(child.props.space) === undefined) {
      return cloneElement(child, { space, spaceAround, separator, beforeSpace, afterSpace })
    }
  }

  if (!space || total <= 1) {
    return (
      <>
        {beforeSpace}
        {children}
        {afterSpace}
      </>
    )
  }
  const spaceElement = separator || <Space size={space} />
  return (
    <>
      {beforeSpace}
      {spaceAround && spaceElement}
      {childs.map((child, index) => (
        <Fragment key={index}>
          {child}
          {index !== total - 1 && spaceElement}
        </Fragment>
      ))}
      {spaceAround && spaceElement}
      {afterSpace}
    </>
  )
}
