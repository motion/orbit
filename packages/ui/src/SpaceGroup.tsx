import React, { Fragment, isValidElement } from 'react'

import { Space, Size } from './Space'

export type SpaceGroupProps = {
  children?: React.ReactNode
  space?: Size
  spaceAround?: Size
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
  const spaceAroundElement =
    separator || spaceAround === true ? spaceElement : <Space size={spaceAround} />

  return (
    <>
      {beforeSpace}
      {spaceAround && spaceAroundElement}
      {childs.map((child, index) => {
        const isSpace = child && child.type && child.type.isSpace
        const isNextSpace =
          childs[index + 1] && childs[index + 1].type && childs[index + 1].type.isSpace
        return isSpace || isNextSpace ? (
          child
        ) : (
          <Fragment key={index}>
            {child}
            {index !== total - 1 && spaceElement}
          </Fragment>
        )
      })}
      {spaceAround && spaceAroundElement}
      {afterSpace}
    </>
  )
}
