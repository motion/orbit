import React, { Fragment } from 'react'

import { Sizes, Space } from './Space'

export type SpaceGroupProps = {
  children: React.ReactNode
  space?: Sizes
  spaceAround?: boolean
  separator?: React.ReactNode
  beforeSpace?: React.ReactNode
  afterSpace?: React.ReactNode
}

const childrenToArr = (x: React.ReactNode): JSX.Element[] =>
  React.Children.map(x, _ => _).filter(y => y !== null && y !== false) as any

export function SpaceGroup(props: SpaceGroupProps) {
  return createSpacedChildren(props)
}

export function createSpacedChildren({
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
  // Allow nested unwraps, for example see <PassProps />
  while (true) {
    if (total === 1) {
      const child = childs[0]
      const type = child.type
      // unwrap fragments and children with `canUnwrap`!
      if (type === React.Fragment || (type && type.canUnwrap)) {
        if (!child.props.children) {
          return null
        }
        childs = childrenToArr(child.props.children)
        total = childs.length
        continue
      }
    }
    break
  }

  if ((!space && !spaceAround) || (!spaceAround && total <= 1)) {
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
