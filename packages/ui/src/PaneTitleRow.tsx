import { gloss, Row } from 'gloss'
import React from 'react'

import { CollapsableProps, CollapseArrow, splitCollapseProps, useCollapse } from './Collapsable'
import { Scale } from './Scale'
import { Space } from './Space'
import { Text, TextProps } from './text/Text'
import { Omit } from './types'
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
    <Scale size={0.8}>
      <PanelHeader onDoubleClick={toggle.toggle}>
        {before}
        {collapseProps.collapsable && (
          <>
            <CollapseArrow {...collapseProps} />
            <Space />
          </>
        )}
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

const PanelHeader = gloss(Row, {
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 500,
  flexShrink: 0,
  padding: [3, 10],
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor],
  backgroundColor: theme.panelHeaderBackground || theme.backgroundZebra,
  '&:not(:first-child)': {
    borderTop: [1, theme.sidebarBorderColor || theme.borderColor],
  },
}))
