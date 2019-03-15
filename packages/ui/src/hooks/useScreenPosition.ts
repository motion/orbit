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
  onChange: ((change: { rect: Rect | undefined; visible: boolean }) => any) | null
  preventMeasure?: true
  debounce?: number
}

export function useScreenPosition(props: UseScreenPositionProps, mountArgs: any[] = []) {
  const { ref, onChange, preventMeasure, debounce = 100 } = props
  const intersected = useRef(false)

  const measure = useCallback(
    _.debounce((nodeRect?) => {
      if (nodeRect === false) {
        onChange({ visible: false, rect: null })
      }
      const node = ref.current
      if (!node) return
      if (!intersected.current) return
      const visible = isVisible(node)
      const rect =
        !visible || preventMeasure ? undefined : getRect(nodeRect || node.getBoundingClientRect())
      onChange({ visible, rect })
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
      measure(entry.boundingClientRect)
    } else {
      intersected.current = false
      measure(false)
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
