import { isEqual } from '@o/fast-compare'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useResizeObserver } from './useResizeObserver'
import { useThrottleFn } from './useThrottleFn'

type Props = {
  ref?: RefObject<HTMLElement>
  disable?: boolean
  onChange?: (size: { width: number; height: number }) => any
  throttle?: number
}

export function useNodeSize(props?: Props) {
  const [state, setState] = useState({ width: 0, height: 0 })
  const updateFn = (props && props.onChange) || setState
  const updateFnThrottled = useThrottleFn(updateFn, props ? props.throttle : 0)
  const update = props && props.throttle > -1 ? updateFnThrottled : updateFn
  const innerRef = useRef<HTMLElement>(null)
  const propRef = props && props.ref
  const ref = propRef || innerRef
  const disable = props && props.disable
  const cur = useRef(null)

  const onChange = useCallback(
    entries => {
      const { width, height } = entries[0].contentRect
      const next = { width, height }
      if (!isEqual(next, cur.current)) {
        cur.current = next
        update(next)
      }
    },
    [update],
  )

  useResizeObserver({
    ref,
    disable,
    onChange,
  })

  useEffect(() => {
    if (disable) return
    if (ref.current) {
      const next = {
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      }
      if (!isEqual(next, state)) {
        setState(next)
      }
    }
  }, [disable, ref])

  return {
    ...state,
    ref,
  }
}
