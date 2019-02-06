import * as React from 'react'
import { BreadcrumbItem, Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs'

export function SegmentedRow(props: BreadcrumbsProps) {
  return <Breadcrumbs {...props} />
}

export function getSegmentRadius(
  props: { ignoreSegment?: boolean; borderRadius?: number },
  item: BreadcrumbItem,
) {
  const radius = typeof props.borderRadius === 'number' ? props.borderRadius : 0
  // support being inside a segmented list
  if (!props.ignoreSegment) {
    if (item) {
      if (item.isFirst) {
        return {
          borderRightRadius: 0,
          borderRightWidth: 0,
          borderLeftRadius: radius,
        }
      } else if (item.isLast) {
        return {
          borderLeftRadius: 0,
          borderRightRadius: radius,
        }
      } else {
        return {
          borderRightRadius: 0,
          borderRightWidth: 0,
          borderLeftRadius: 0,
        }
      }
    }
  }
  return {
    borderRightRadius: radius,
    borderLeftRadius: radius,
  }
}
