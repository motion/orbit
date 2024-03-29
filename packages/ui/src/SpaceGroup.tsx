import { isDefined } from '@o/utils'
import React, { Fragment, isValidElement } from 'react'

import { hasMediaQueries, mediaQueryKeysSpace } from './mediaQueryKeys'
import { Size, Space } from './Space'

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
  return createSpacedChildren(props, props)
}

function getChildrenForSpacing(childs: React.ReactNode) {
  let children = []
  // Allows special cases for unwrapping/forwarding spacing
  // Allow nested unwraps, for example see <PassProps />
  for (const child of React.Children.toArray(childs)) {
    if (!isValidElement(child)) {
      if (child === null || child === false || child === undefined || child === '') {
        continue
      }
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

export function createSpacedChildren(
  props: SpaceGroupProps,
  // allow media query sizes like sm-size md-size
  allProps: {
    [key: string]: any
  },
) {
  if (!props.children) {
    return null
  }
  const childs = getChildrenForSpacing(props.children)
  const total = childs.length

  // media query props
  let sizeMediaQueries = null
  if (hasMediaQueries) {
    for (const key in mediaQueryKeysSpace) {
      if (isDefined(allProps[key])) {
        sizeMediaQueries = sizeMediaQueries || {}
        sizeMediaQueries[key.replace('-space', '-size')] = allProps[key]
      }
    }
  }

  if ((!props.space && !props.spaceAround) || (!props.spaceAround && total <= 1)) {
    return (
      <>
        {props.beforeSpace}
        {props.children}
        {props.afterSpace}
      </>
    )
  }

  const spaceElement = props.separator || <Space size={props.space} {...sizeMediaQueries} />
  const spaceAroundElement =
    props.separator || props.spaceAround === true ? (
      spaceElement
    ) : (
      <Space size={props.spaceAround} />
    )

  return (
    <>
      {props.beforeSpace}
      {props.spaceAround && spaceAroundElement}
      {childs.map((child, index) => {
        const isSpace = child && child.type && child.type.isSpace
        const isNextSpace =
          childs[index + 1] && childs[index + 1].type && childs[index + 1].type.isSpace
        return isSpace || isNextSpace ? (
          <Fragment key={index}>{child}</Fragment>
        ) : (
          <Fragment key={index}>
            {child}
            {index !== total - 1 && spaceElement}
          </Fragment>
        )
      })}
      {props.spaceAround && spaceAroundElement}
      {props.afterSpace}
    </>
  )
}
