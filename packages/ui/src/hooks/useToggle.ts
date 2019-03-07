import { useState } from 'react'

export function useToggle(defaultValue: boolean): [boolean, (...args: any) => void] {
  const [state, setState] = useState(defaultValue)
  return [state, () => setState(!state)]
}
