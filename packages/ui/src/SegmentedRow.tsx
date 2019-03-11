import * as React from 'react'
import { BreadcrumbItem, Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs'
import { SurfacePassProps, SurfaceProps } from './Surface'

// manages a row of surfaces nicely
// will round the start/end corners
// will pass props deeply down to them if they need

export function SegmentedRow({
  children,
  separator,
  ...surfaceProps
}: BreadcrumbsProps & SurfaceProps) {
  return (
    <SurfacePassProps {...surfaceProps}>
      <Breadcrumbs children={children} separator={separator} />
    </SurfacePassProps>
  )
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
