import { gloss } from 'gloss'
import React from 'react'

import { BorderTop } from './Border'
import { CollapsableProps, CollapseArrow, splitCollapseProps, useCollapse } from './Collapsable'
import { Scale } from './Scale'
import { Text, TextProps } from './text/Text'
import { Stack } from './View/Stack'
import { View } from './View/View'

export type PaneTitleRowProps = CollapsableProps &
  Omit<TextProps, 'children'> & {
    after?: React.ReactNode
    before?: React.ReactNode
    title?: React.ReactNode
  }

export type PaneTitleRowParentProps = Pick<PaneTitleRowProps, 'title'> & {
  afterTitle?: PaneTitleRowProps['after']
  beforeTitle?: PaneTitleRowProps['before']
}

export function PaneTitleRow({ after, before, title, ...rest }: PaneTitleRowProps) {
  const [collapseProps, textProps] = splitCollapseProps(rest)
  const toggle = useCollapse(collapseProps)
  return (
    <Scale size={0.85}>
      <PanelHeader
        padding="sm"
        subTheme="panelHeader"
        space="xs"
        onDoubleClick={toggle.isCollapsable ? toggle.toggle : undefined}
      >
        <BorderTop opacity={0.5} />
        {before}
        {collapseProps.collapsable && <CollapseArrow {...collapseProps} />}
        <View flex={1}>
          <Text alpha={0.65} {...textProps}>
            {title}
          </Text>
        </View>
        {after}
      </PanelHeader>
    </Scale>
  )
}

const PanelHeader = gloss(Stack, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 500,
  flexShrink: 0,
  position: 'relative',
})
