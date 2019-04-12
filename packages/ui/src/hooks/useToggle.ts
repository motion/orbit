import { useEffect, useRef, useState } from 'react'
import { CollapsableProps } from '../Collapsable'

export type Toggler = {
  val: boolean
  toggle: () => void
  setState: any
  collapseProps: CollapsableProps
  isCollapsable?: boolean
}

export function useToggle(
  cur: boolean,
  onChange?: (next: boolean) => any,
  props?: CollapsableProps,
): Toggler {
  const prev = useRef(cur)
  const [val, setState] = useState(cur)

  useEffect(() => {
    if (prev.current !== cur) {
      setState(cur)
    }
  }, [cur])

  useEffect(() => {
    if (!onChange) return
    if (prev.current === val) return
    prev.current = val
    onChange(val)
  }, [onChange, val])

  const toggle = () => setState(!val)

  return {
    isCollapsable: (props && props.collapsable) || false,
    val,
    toggle,
    setState,
    collapseProps: props,
  }
}
