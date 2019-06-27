import { gloss } from 'gloss'
import React from 'react'

import { BorderTop } from './Border'
import { CollapsableProps, CollapseArrow, splitCollapseProps, useCollapse } from './Collapsable'
import { Scale, useScale } from './Scale'
import { Text, TextProps } from './text/Text'
import { Omit } from './types'
import { View } from './View/View'
import { Row } from './View/Row'

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
      <PanelHeader space="xs" onDoubleClick={toggle.toggle}>
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

const PanelHeader = gloss(Row, {
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 500,
  flexShrink: 0,
  position: 'relative',
}).theme((_, theme) => {
  const scale = useScale()
  return {
    padding: [6 * scale, 8 * scale],
    backgroundColor: theme.panelHeaderBackground || theme.backgroundZebra,
  }
})
