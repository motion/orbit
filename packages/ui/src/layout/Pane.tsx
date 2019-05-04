import React, { Suspense, isValidElement, cloneElement } from 'react'

import { Collapsable, CollapsableProps, splitCollapseProps, useCollapse } from '../Collapsable'
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
  const toggle = useCollapse(collapseProps)
  const hasTitle = !!(title || afterTitle || beforeTitle)
  return (
    <SizablePane {...sizablePaneProps} collapsed={toggle.val}>
      {hasTitle && (
        <PaneTitleRow
          title={title}
          after={afterTitle}
          before={beforeTitle}
          {...collapseProps}
          useCollapse={toggle}
        />
      )}
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
          position="relative"
          useCollapse={toggle}
        >
          {/* enforce 100% max height for pane contents... */}
          {isValidElement(children)
            ? cloneElement(children as any, { maxHeight: children.props['maxHeight'] || '100%' })
            : children}
        </Col>
      </Suspense>
    </SizablePane>
  )
}
