import React, { Suspense } from 'react'
import { Collapsable, CollapsableProps } from '../Collapsable'
import { useToggle } from '../hooks/useToggle'
import { PaneTitleRow, PaneTitleRowParentProps } from '../PaneTitleRow'
import { Loading } from '../progress/Loading'
import { Col, ColProps } from '../View/Col'
import { SizablePane, SizablePaneProps } from './SizablePane'

export type PaneProps = ColProps &
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
  pad,
  padding,
  scrollable,
  space,
  spaceAround,
  flexDirection,
  ...sizablePaneProps
}: PaneProps) {
  const toggle = useToggle(collapsed, onCollapse)
  const hasTitle = !!(title || afterTitle || beforeTitle)
  return (
    <SizablePane {...sizablePaneProps} collapsed={toggle.val}>
      {hasTitle && (
        <PaneTitleRow
          title={title}
          after={afterTitle}
          before={beforeTitle}
          collapsable={collapsable}
          {...toggle.getProps()}
        />
      )}
      <Collapsable useToggle={toggle}>
        <Suspense fallback={<Loading />}>
          <Col
            space={space}
            spaceAround={spaceAround}
            flexDirection={flexDirection}
            scrollable={scrollable}
            pad={pad}
            padding={padding}
            width="100%"
            height="100%"
          >
            {children}
          </Col>
        </Suspense>
      </Collapsable>
    </SizablePane>
  )
}
