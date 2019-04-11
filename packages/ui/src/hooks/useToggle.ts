import { useEffect, useRef, useState } from 'react'
import { CollapsableProps } from '../Collapsable'

export type Toggler = {
  val: boolean
  toggle: () => void
  setState: any
  getProps: () => Pick<CollapsableProps, 'onCollapse' | 'collapsed'>
}

export function useToggle(cur: boolean, onChange?: (next: boolean) => any): Toggler {
  const prev = useRef(cur)
  const [val, setState] = useState(cur)

  console.log('toggle state is', val)

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
    val,
    toggle,
    setState,
    getProps() {
      return {
        onCollapse: toggle,
        collapsed: val,
      }
    },
  }
}
