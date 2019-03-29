import { useEffect, useState } from 'react'

export function useToggle(defaultValue: boolean, onChange?: (next: boolean) => any) {
  const [val, setState] = useState(defaultValue)

  useEffect(
    () => {
      setState(defaultValue)
    },
    [defaultValue],
  )

  useEffect(() => onChange && onChange(val), [onChange, val])

  return {
    val,
    toggle: () => setState(!val),
    setState,
  }
}
