import { gloss } from '@o/gloss'
import { selectDefined } from '@o/utils'
import React from 'react'

import { Toggler, useToggle } from './hooks/useToggle'
import { Icon } from './Icon'
import { Omit } from './types'

export type CollapsableProps = {
  /** Uncontrolled: set initial state as collapsed */
  defaultCollapsed?: boolean

  /** Enable collapsing this element */
  collapsable?: boolean

  /** Controlled: set state collapsed */
  collapsed?: boolean

  /** Callback on collapse change */
  onCollapse?: (next: boolean) => any

  /** Pass in a `useToggle` that controls collapse state */
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
    ...rest
  } = all
  if (
    selectDefined(defaultCollapsed, collapsed, collapsable, onCollapse, useToggle) === undefined
  ) {
    return [null, rest]
  }
  return [{ defaultCollapsed, collapsed, collapsable, onCollapse, useToggle: useToggleOg }, rest]
}

export const useCollapseToggle = (props: CollapsableProps) => {
  if (props.useToggle) {
    return props.useToggle
  }
  return useToggle(
    selectDefined(props.defaultCollapsed, props.collapsed, false),
    props.onCollapse,
    props,
  )
}

export type CollapsableViewProps = CollapsableProps & { children: React.ReactNode }

export const Collapsable = (props: CollapsableViewProps) => {
  return createCollapsableChildren(props)
}

export const createCollapsableChildren = (props: CollapsableViewProps) => {
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
  const toggle = useCollapseToggle(props)
  if (!toggle.isCollapsable) {
    return null
  }
  return (
    <Chevron
      onClick={toggle.toggle}
      name="chevron-right"
      size={12}
      transform={{
        rotate: toggle.val ? '0' : '90deg',
      }}
    />
  )
}

const Chevron = gloss(Icon, {
  marginRight: 4,
  marginLeft: -2,
  transition: 'all ease 200ms',
}).theme((props, theme) => ({
  color: selectDefined(props.color, theme.iconColor, theme.color),
}))
