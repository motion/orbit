import { gloss, Row } from '@o/gloss'
import React from 'react'
import { CollapsableProps, CollapseArrow } from './Collapsable'
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

export function PaneTitleRow({
  collapsable,
  collapsed,
  onCollapse,
  after,
  before,
  title,
  ...textProps
}: PaneTitleRowProps) {
  return (
    <PanelHeader onClick={onCollapse}>
      {before}
      {collapsable && (
        <>
          <CollapseArrow collapsed={collapsed} />
          <Space size="xs" />
        </>
      )}
      <View flex={1}>
        <Text size={0.9} alpha={0.65} {...textProps}>
          {title}
        </Text>
      </View>
      {after}
    </PanelHeader>
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
