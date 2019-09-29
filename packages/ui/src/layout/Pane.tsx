import React, { cloneElement, isValidElement, memo, Suspense } from 'react'

import { Button, ButtonProps } from '../buttons/Button'
import { CollapsableProps, splitCollapseProps, useCollapse } from '../Collapsable'
import { PaneTitleRow, PaneTitleRowParentProps } from '../PaneTitleRow'
import { Loading } from '../progress/Loading'
import { Stack, StackProps } from '../View/Stack'
import { SizablePane, SizablePaneProps } from './SizablePane'

export type PaneProps = StackProps &
  SizablePaneProps &
  Partial<CollapsableProps> &
  PaneTitleRowParentProps & {
    above?: React.ReactNode
    below?: React.ReactNode
  }

export const Pane = memo((props: PaneProps) => {
  const [
    collapseProps,
    {
      title,
      afterTitle,
      beforeTitle,
      children,
      padding,
      scrollable = 'y',
      space,
      spaceAround,
      flexDirection,
      above,
      flex = 1,
      below,
      ...sizablePaneProps
    },
  ] = splitCollapseProps(props)
  const toggle = useCollapse(collapseProps)
  const hasTitle = !!(title || afterTitle || beforeTitle)
  return (
    <SizablePane {...sizablePaneProps} collapsed={toggle.val} flex={flex}>
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
        {above}
        <Stack
          space={space}
          spaceAround={spaceAround}
          flexDirection={flexDirection}
          scrollable={scrollable}
          padding={toggle.isCollapsable && toggle.val ? 0 : padding}
          width="100%"
          flex={1}
          position="relative"
          useCollapse={toggle}
        >
          {/* enforce 100% max height for pane contents... */}
          {isValidElement(children)
            ? cloneElement(children as any, { maxHeight: children.props['maxHeight'] || '100%' })
            : children}
        </Stack>
        {below}
      </Suspense>
    </SizablePane>
  )
})

Pane['acceptsProps'] = {
  paneProps: true,
}

export const PaneButton = (props: ButtonProps) => <Button size={0.7} sizeIcon={2.3} {...props} />
