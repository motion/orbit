import React, { Suspense } from 'react'
import { Collapsable, CollapsableProps } from '../Collapsable'
import { useToggle } from '../hooks/useToggle'
import { PaddedProps } from '../Padded'
import { PaneTitleRow, PaneTitleRowParentProps } from '../PaneTitleRow'
import { Loading } from '../progress/Loading'
import { Scrollable } from '../Scrollable'
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
  padding,
  scrollable,
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
    <SizablePane {...sizablePaneProps} collapsed={collapsableProps.collapsed}>
      {hasTitle && (
        <PaneTitleRow title={title} after={afterTitle} before={beforeTitle} {...collapsableProps} />
      )}
      <Collapsable {...collapsableProps}>
        <Suspense fallback={<Loading />}>
          <Scrollable scrollable={scrollable} padded={padded} padding={padding}>
            {children}
          </Scrollable>
        </Suspense>
      </Collapsable>
    </SizablePane>
  )
}
