import { useEffect, useRef, useState } from 'react'

export function useThrottle(value: any, limit = 0) {
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
  }, [value, limit])

  return next
}
