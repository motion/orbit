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
  return useToggle(
    selectDefined(props.defaultCollapsed, props.collapsed, false),
    props.onCollapse,
    props,
  )
}

export const Collapsable = (props: CollapsableProps & { children: React.ReactNode }) => {
  const innerToggle = useCollapseToggle(props)
  const toggle = props.useToggle || innerToggle
  // this inherits from useToggle nicely, not the clearest pattern...
  const isCollapsable = props.useToggle ? toggle.collapseProps.collapsable : props.collapsable
  if (isCollapsable === false) {
    return <>{props.children}</>
  }
  return <>{toggle.val ? null : props.children || null}</>
}

export const CollapseArrow = (props: CollapsableProps) => {
  const isCollapsable = selectDefined(
    props.collapsable,
    props.useToggle ? props.useToggle.collapseProps.collapsable : undefined,
  )
  if (!isCollapsable) {
    return null
  }
  const val = selectDefined(props.collapsed, props.useToggle && props.useToggle.val)
  const onClick = selectDefined(props.onCollapse, props.useToggle && props.useToggle.toggle)
  return (
    <Chevron
      onClick={onClick}
      name="chevron-right"
      size={12}
      transform={{
        rotate: val ? 0 : '90deg',
      }}
    />
  )
}

const Chevron = gloss(Icon, {
  marginRight: 4,
  marginLeft: -2,
  transition: 'all ease 200ms',
}).theme(theme => ({
  color: theme.iconColor || theme.color,
}))
