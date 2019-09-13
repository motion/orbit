import { isDefined, selectDefined } from '@o/utils'
import React from 'react'

import { BreadcrumbInfo, Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs'
import { SizedSurfaceProps } from './SizedSurface'
import { SurfacePassProps, useSurfaceProps } from './SizedSurfacePropsContext'
import { SurfaceProps } from './Surface'

// manages a row of surfaces nicely
// will round the start/end corners
// will pass props deeply down to them if they need

export function SegmentedRow({
  children,
  separator,
  ...rest
}: BreadcrumbsProps & Partial<SizedSurfaceProps>) {
  const props = useSurfaceProps(rest)
  return (
    <SurfacePassProps {...props}>
      <Breadcrumbs separator={separator}>{children}</Breadcrumbs>
    </SurfacePassProps>
  )
}

export function getSegmentedStyle(props: SurfaceProps, item: BreadcrumbInfo) {
  if (props.ignoreSegment) {
    return
  }
  const next = {
    ...getSegmentBorderRadius(props, item),
    ...getInnerBorderOffsetStyle(props, item),
  }
  if (isDefined(props.borderLeftRadius)) {
    next.borderLeftRadius = props.borderLeftRadius
  }
  if (isDefined(props.borderRightRadius)) {
    next.borderRightRadius = props.borderRightRadius
  }
  return next
}

const getInnerBorderOffsetStyle = (_props: SurfaceProps, item: BreadcrumbInfo) => {
  if (item && !item.isFirst) {
    return {
      marginLeft: -1,
    }
  }
}

const getSegmentBorderRadius = (props: SurfaceProps, item: BreadcrumbInfo) => {
  const radius = selectDefined(props.borderRadius, 0)
  const isSegmented = isDefined(props.segment, item || undefined)

  if (isSegmented) {
    const propIsFirst = props.segment === 'first' || props.segment === 'single' ? true : undefined
    const propIsLast = props.segment === 'last' || props.segment === 'single' ? true : undefined
    const isFirst = selectDefined(propIsFirst, item && item.isFirst)
    const isLast = selectDefined(propIsLast, item && item.isLast)

    if (isFirst && isLast) {
      return {
        borderRadius: radius,
      }
    }
    if (isFirst) {
      return {
        ...(props.borderPosition !== 'inside' && {
          borderRightWidth: 0,
          borderLeftWidth: props.borderWidth,
          borderTopWidth: props.borderWidth,
          borderBottomWidth: props.borderWidth,
        }),
        borderRightRadius: 0,
        borderLeftRadius: radius,
      }
    } else if (isLast) {
      return {
        borderLeftRadius: 0,
        borderRightRadius: radius,
      }
    } else {
      return {
        ...(props.borderPosition !== 'inside' && {
          borderRightWidth: 0,
          borderLeftWidth: props.borderWidth,
          borderTopWidth: props.borderWidth,
          borderBottomWidth: props.borderWidth,
        }),
        borderRightRadius: 0,
        borderLeftRadius: 0,
      }
    }
  }
  // support being inside a segmented list
  return {
    borderRightRadius: radius,
    borderLeftRadius: radius,
  }
}
