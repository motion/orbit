import { useEffect, useRef, useState } from 'react'

export function useToggle(defaultValue: boolean, onChange?: (next: boolean) => any) {
  const prev = useRef(defaultValue)
  const [val, setState] = useState(defaultValue)

  useEffect(
    () => {
      if (prev.current !== defaultValue) {
        prev.current = defaultValue
        setState(defaultValue)
      }
    },
    [defaultValue],
  )

  useEffect(
    () => {
      if (!onChange) return
      if (prev.current === val) return
      prev.current = val
      onChange(val)
    },
    [onChange, val],
  )

  return {
    val,
    toggle: () => setState(!val),
    setState,
  }
}
