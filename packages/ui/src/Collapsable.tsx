import { selectDefined } from '@o/utils'
import { gloss } from 'gloss'
import React, { useMemo } from 'react'

import { Toggler, useToggle } from './hooks/useToggle'
import { Icon } from './Icon'

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
  useCollapse?: Toggler
}

export const splitCollapseProps = <A extends CollapsableProps>(
  all: A,
): [CollapsableProps, Omit<A, keyof CollapsableProps>] => {
  return useMemo(() => {
    const {
      defaultCollapsed,
      collapsed,
      collapsable,
      onCollapse,
      useCollapse: useToggleOg,
      ...rest
    } = all
    if (
      selectDefined(defaultCollapsed, collapsed, collapsable, onCollapse, useToggle) === undefined
    ) {
      return [null, rest] as any
    }
    return [
      { defaultCollapsed, collapsed, collapsable, onCollapse, useCollapse: useToggleOg },
      rest,
    ]
  }, [all])
}

export const useCollapse = (props: CollapsableProps) => {
  if (props.useCollapse) {
    return props.useCollapse
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
  const innerToggle = useCollapse(props)
  const toggle = props.useCollapse || innerToggle
  // this inherits from useToggle nicely, not the clearest pattern...
  const isCollapsable = props.useCollapse ? toggle.collapseProps.collapsable : props.collapsable
  if (isCollapsable === false) {
    return <>{props.children}</>
  }
  return <>{toggle.val ? null : props.children || null}</>
}

export const CollapseArrow = (props: CollapsableProps) => {
  const toggle = useCollapse(props)
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
