import { useEffect, useRef, useState } from 'react'

export function useThrottle(value: any, limit = 0, mountArgs?: any[]) {
  const [next, setNext] = useState(value)
  const last = useRef(Date.now())

  useEffect(() => {
    const tm = setTimeout(() => {
      if (Date.now() - last.current >= limit) {
        setNext(value)
        last.current = Date.now()
      }
    }, limit - (Date.now() - last.current))

    return () => {
      clearTimeout(tm)
    }
  }, [...(mountArgs ? mountArgs : [value]), limit])

  return next
}
