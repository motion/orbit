import * as React from 'react'
import { BreadcrumbItem, Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs'

export function SegmentedRow(props: BreadcrumbsProps) {
  return <Breadcrumbs {...props} />
}

export function getSegmentRadius(
  props: { ignoreSegment?: boolean; borderRadius: number },
  item: BreadcrumbItem,
) {
  // support being inside a segmented list
  if (!props.ignoreSegment) {
    if (item) {
      if (item.isFirst) {
        return {
          borderRightRadius: 0,
          borderRightWidth: 0,
          borderLeftRadius: +props.borderRadius,
        }
      } else if (item.isLast) {
        return {
          borderLeftRadius: 0,
          borderRightRadius: +props.borderRadius,
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
    borderRightRadius: +props.borderRadius,
    borderLeftRadius: +props.borderRadius,
  }
}
