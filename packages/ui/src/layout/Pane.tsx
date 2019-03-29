import React, { Suspense } from 'react'
import { Collapsable, CollapsableProps } from '../Collapsable'
import { useToggle } from '../hooks/useToggle'
import { PaneTitleRow, PaneTitleRowParentProps } from '../PaneTitleRow'
import { Loading } from '../progress/Loading'
import { SizablePane, SizablePaneProps } from './SizablePane'

export type PaneProps = SizablePaneProps & Partial<CollapsableProps> & PaneTitleRowParentProps

export function Pane({
  title,
  afterTitle,
  beforeTitle,
  collapsable,
  onCollapse,
  collapsed,
  children,
  ...sizablePaneProps
}: PaneProps) {
  const collapseToggle = useToggle(collapsed, onCollapse)
  const collapsableProps = {
    collapsable,
    onCollapse: collapseToggle.toggle,
    collapsed: collapseToggle.val,
  }
  const hasTitle = !!(title || afterTitle || beforeTitle)
  return (
    <SizablePane {...sizablePaneProps}>
      {hasTitle && (
        <PaneTitleRow title={title} after={afterTitle} before={beforeTitle} {...collapsableProps} />
      )}
      <Collapsable {...collapsableProps}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </Collapsable>
    </SizablePane>
  )
}
