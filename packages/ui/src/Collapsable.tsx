import { gloss } from '@o/gloss'
import React from 'react'
import { useToggle } from './hooks/useToggle'
import { Icon } from './Icon'

export type CollapsableProps = {
  collapsable?: boolean
  collapsed?: boolean
  onCollapse: (next: boolean) => any
}

export function Collapsable(props: CollapsableProps & { children: React.ReactNode }) {
  const collapsed = useToggle(props.collapsed || false, props.onCollapse)

  if (!props.collapsable) {
    return <>{props.children}</>
  }

  return <>{collapsed.val ? null : props.children || null}</>
}

export const CollapseArrow = ({ collapsed }) => (
  <Chevron name={collapsed ? 'chevron-right' : 'chevron-down'} size={12} />
)

const Chevron = gloss(Icon, {
  marginRight: 4,
  marginLeft: -2,
  marginBottom: 1,
}).theme(theme => ({
  color: theme.iconColor || theme.color,
}))
