import { selectDefined } from '@o/utils'
import { useEffect, useState } from 'react'

import { useThrottleFn } from './useThrottleFn'

/** [width, height] */
type Size = [number, number]

const windowSize = (): Size => [window.innerWidth, window.innerHeight]

const idFn = _ => _

export function useWindowSize(opts: { throttle?: number; adjust?: (x: Size) => Size } = {}): Size {
  const adjust = (opts && opts.adjust) || idFn
  const [size, setSize] = useState(adjust(windowSize()))
  const setSizeThrottle = useThrottleFn(setSize, { amount: selectDefined(opts.throttle, 100) })

  useEffect(() => {
    const update = () => setSizeThrottle(adjust(windowSize()))
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
    }
  }, [])

  return size
}
