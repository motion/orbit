import React, { Fragment, isValidElement } from 'react'

import { Sizes, Space } from './Space'

export type SpaceGroupProps = {
  children: React.ReactNode
  space?: Sizes
  spaceAround?: boolean
  separator?: React.ReactNode
  beforeSpace?: React.ReactNode
  afterSpace?: React.ReactNode
}

const addChild = (all, child) => {
  if (child && child.props.children === 'Examples') {
    debugger
  }
  const last = all[all.length - 1]
  if (last && last.type && last.type.isSpace) {
    if (child && child.type && child.type.isSpace) {
      return
    }
  }
  all.push(child)
}

const childrenToArr = (x: React.ReactNode): JSX.Element[] => {
  let final = []
  for (const child of React.Children.toArray(x)) {
    if (child === null || child === false) continue
    if (isValidElement(child)) {
      if (child.type === React.Fragment || child.type['canUnwrap']) {
        if (!child.props.children) {
          continue
        }
        const next = childrenToArr(child.props.children)
        for (const subChild of next) {
          addChild(final, subChild)
        }
        continue
      }
    }
    addChild(final, child)
  }
  console.log('final', final)
  return final
}
// React.Children.map(x, _ => _).filter(y => y !== null && y !== false) as any

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
