import React, { Fragment, isValidElement } from 'react'

import { Sizes, Space } from './Space'

export type SpaceGroupProps = {
  children?: React.ReactNode
  space?: Sizes
  spaceAround?: boolean
  separator?: React.ReactNode
  beforeSpace?: React.ReactNode
  afterSpace?: React.ReactNode
}

const childrenToArr = (x: React.ReactNode): JSX.Element[] =>
  React.Children.toArray(x).filter(y => y !== null && y !== false) as any

export function SpaceGroup(props: SpaceGroupProps) {
  return createSpacedChildren(props)
}

function getChildrenForSpacing(childs: React.ReactNode) {
  let children = []
  // Allows special cases for unwrapping/forwarding spacing
  // Allow nested unwraps, for example see <PassProps />
  for (const child of React.Children.toArray(childs)) {
    if (!isValidElement(child)) {
      children.push(child)
      continue
    }
    const type = child.type
    if (type === React.Fragment || (type && type['canUnwrap'])) {
      const subChildren = child.props['children']
      if (!subChildren) {
        continue
      }
      const next = childrenToArr(subChildren)
      children = [...children, ...next]
    } else {
      children.push(child)
    }
  }
  return children
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
  const childs = getChildrenForSpacing(children)
  const total = childs.length

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
      {childs.map((child, index) =>
        child && child.type && child.type.isSpace ? (
          child
        ) : (
          <Fragment key={index}>
            {child}
            {index !== total - 1 && spaceElement}
          </Fragment>
        ),
      )}
      {spaceAround && spaceElement}
      {afterSpace}
    </>
  )
}
