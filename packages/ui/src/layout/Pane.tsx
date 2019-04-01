import React, { Suspense } from 'react'
import { Collapsable, CollapsableProps } from '../Collapsable'
import { useToggle } from '../hooks/useToggle'
import { PaneTitleRow, PaneTitleRowParentProps } from '../PaneTitleRow'
import { Loading } from '../progress/Loading'
import { Padded, PaddedProps } from './Padded'
import { SizablePane, SizablePaneProps } from './SizablePane'

export type PaneProps = PaddedProps &
  SizablePaneProps &
  Partial<CollapsableProps> &
  PaneTitleRowParentProps

export function Pane({
  title,
  afterTitle,
  beforeTitle,
  collapsable,
  onCollapse,
  collapsed,
  children,
  padded,
  ...sizablePaneProps
}: PaneProps) {
  const collapseToggle = useToggle(collapsed, onCollapse)
  const collapsableProps = {
    collapsable,
    onCollapse: collapseToggle.toggle,
    collapsed: collapseToggle.val,
  }
  const hasTitle = !!(title || afterTitle || beforeTitle)
  if (typeof sizablePaneProps.height !== 'undefined' && isNaN(sizablePaneProps.height)) {
    debugger
  }
  return (
    <SizablePane {...sizablePaneProps}>
      {hasTitle && (
        <PaneTitleRow title={title} after={afterTitle} before={beforeTitle} {...collapsableProps} />
      )}
      <Collapsable {...collapsableProps}>
        <Suspense fallback={<Loading />}>
          <Padded padded={padded}>{children}</Padded>
        </Suspense>
      </Collapsable>
    </SizablePane>
  )
}
