import React, { Suspense } from 'react'

import { Collapsable, CollapsableProps, splitCollapseProps, useCollapseToggle } from '../Collapsable'
import { PaneTitleRow, PaneTitleRowParentProps } from '../PaneTitleRow'
import { Loading } from '../progress/Loading'
import { Col, ColProps } from '../View/Col'
import { SizablePane, SizablePaneProps } from './SizablePane'

export type PaneProps = ColProps &
  SizablePaneProps &
  Partial<CollapsableProps> &
  PaneTitleRowParentProps

export function Pane(props: PaneProps) {
  const [
    collapseProps,
    {
      title,
      afterTitle,
      beforeTitle,
      children,
      pad,
      padding,
      scrollable,
      space,
      spaceAround,
      flexDirection,
      ...sizablePaneProps
    },
  ] = splitCollapseProps(props)
  const toggle = useCollapseToggle(collapseProps)
  const hasTitle = !!(title || afterTitle || beforeTitle)
  return (
    <SizablePane {...sizablePaneProps} collapsed={toggle.val}>
      {hasTitle && (
        <PaneTitleRow
          title={title}
          after={afterTitle}
          before={beforeTitle}
          {...collapseProps}
          useToggle={toggle}
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
