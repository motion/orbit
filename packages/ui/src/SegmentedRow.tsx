import { selectDefined } from '@o/utils'
import React from 'react'

import { BreadcrumbInfo, Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs'
import { SizedSurfaceProps } from './SizedSurface'
import { SurfacePassProps, SurfaceProps, useSurfaceProps } from './Surface'

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
  return {
    ...getSegmentBorderRadius(props, item),
    ...getInnerBorderOffsetStyle(props, item),
  }
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
  if (item) {
    if (item.isFirst && item.isLast) {
      return {
        borderRadius: radius,
      }
    }
    if (item.isFirst) {
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
    } else if (item.isLast) {
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
