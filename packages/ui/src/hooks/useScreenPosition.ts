import _ from 'lodash'
import { RefObject, useCallback, useEffect, useRef } from 'react'
import { useIntersectionObserver } from './useIntersectionObserver'
import { useMutationObserver } from './useMutationObserver'
import { useResizeObserver } from './useResizeObserver'

export type Rect = {
  width: number
  height: number
  top: number
  left: number
}

export function getRect(o: any) {
  return { width: o.width, height: o.height, left: o.left, top: o.top }
}

type UseScreenPositionProps = {
  ref: RefObject<HTMLElement>
  onChange: ((rect: Rect | undefined) => any) | null
  preventMeasure?: true
  debounce?: number
}

export function useScreenPosition(props: UseScreenPositionProps, mountArgs: any[] = []) {
  const { ref, onChange, preventMeasure, debounce = 100 } = props
  const intersected = useRef(false)

  const measure = useCallback(
    _.debounce((rect?) => {
      const node = ref.current
      if (!node || !isVisible(node)) return
      if (!intersected.current) return
      onChange(preventMeasure ? undefined : getRect(rect || node.getBoundingClientRect()))
    }, debounce),
    [props.preventMeasure],
  )

  useResizeObserver(ref, _.debounce(entries => measure(entries[0].contentRect)))

  useMutationObserver(ref, { attributes: true }, measure)

  useIntersectionObserver(ref, entries => {
    if (!entries) return
    const [entry] = entries
    if (entry.isIntersecting) {
      intersected.current = true
      onChange(preventMeasure ? undefined : getRect(entry.boundingClientRect))
    } else {
      intersected.current = false
      onChange(undefined)
    }
  })

  useEffect(measure, [ref, ...mountArgs])
}

function isVisible(ele) {
  const style = window.getComputedStyle(ele)
  return (
    style.width !== '0' &&
    style.height !== '0' &&
    style.opacity !== '0' &&
    style.display !== 'none' &&
    style.visibility !== 'hidden'
  )
}
