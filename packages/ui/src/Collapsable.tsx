import { gloss } from '@o/gloss'
import { selectDefined } from '@o/utils'
import React from 'react'
import { Toggler, useToggle } from './hooks/useToggle'
import { Icon } from './Icon'

export type CollapsableProps = {
  defaultCollapsed?: boolean
  collapsable?: boolean
  collapsed?: boolean
  onCollapse?: (next: boolean) => any
  useToggle?: Toggler
}

export const splitCollapseProps = <A extends CollapsableProps>(
  all: A,
): [CollapsableProps, Omit<A, keyof CollapsableProps>] => {
  const {
    defaultCollapsed,
    collapsed,
    collapsable,
    onCollapse,
    useToggle: useToggleOg,
    ...props
  } = all
  return [{ defaultCollapsed, collapsed, collapsable, onCollapse, useToggle: useToggleOg }, props]
}

export const useCollapseToggle = (props: CollapsableProps) => {
  return useToggle(selectDefined(props.defaultCollapsed, props.collapsed, false), props.onCollapse)
}

export const Collapsable = (props: CollapsableProps & { children: React.ReactNode }) => {
  const innerToggle = useCollapseToggle(props)
  const toggle = props.useToggle || innerToggle
  if (!props.collapsable) {
    return <>{props.children}</>
  }
  return <>{toggle.val ? null : props.children || null}</>
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
