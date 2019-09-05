import { isEqual } from '@o/fast-compare'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { useGetVisibility } from '../Visibility'
import { useResizeObserver } from './useResizeObserver'
import { useThrottledFn } from './useThrottleFn'

export type UseNodeSizeProps = {
  ref?: RefObject<HTMLElement>
  disable?: boolean
  onChange?: (size: { width: number; height: number }) => any
  throttle?: number
  ignoreFirst?: boolean
}

type SizeState = {
  width: number
  height: number
}

export function useNodeSize(props: UseNodeSizeProps = {}, mountArgs: any[] = []) {
  const getVisible = useGetVisibility()
  const [state, setState] = useState<SizeState>({ width: 0, height: 0 })
  const updateFn = (val: SizeState) => {
    // avoid updates when not visible, it can return width: 0, height: 0
    if (!getVisible()) {
      return
    }
    const cb = props.onChange || setState
    cb(val)
  }
  const updateFnThrottled = useThrottledFn(updateFn, {
    amount: props.throttle || 0,
    ignoreFirst: props.ignoreFirst,
  })
  const update = props.throttle > -1 ? updateFnThrottled : updateFn
  const innerRef = useRef<HTMLElement>(null)
  const propRef = props.ref
  const ref = propRef || innerRef
  const disable = props.disable
  const cur = useRef(null)

  useResizeObserver(
    {
      ref,
      disable,
      onChange: entries => {
        const { width, height } = entries[0].contentRect
        const next = { width, height }
        if (!isEqual(next, cur.current)) {
          cur.current = next
          if (props['debug']) console.log(next)
          update(next)
        }
      },
    },
    [mountArgs],
  )

  const updateSize = () => {
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
  }

  // useMutationObserve(
  //   {
  //     ref,
  //     disable,
  //     options: {
  //       attributes: true,
  //       childList: true,
  //       subtree: true,
  //     },
  //     onChange: updateSize,
  //   },
  //   [mountArgs],
  // )

  // useLayout?
  useEffect(updateSize, [disable, ref, ...mountArgs])

  return useMemo(
    () => ({
      ...state,
      ref,
    }),
    [state.width, state.height, ref],
  )
}
