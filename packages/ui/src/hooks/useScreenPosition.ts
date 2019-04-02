import _ from 'lodash'
import { RefObject, useCallback, useEffect, useRef } from 'react'
import { useVisiblity } from '../Visibility'
import { useGet } from './useGet'
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
  const { ref, preventMeasure, debounce = 100 } = props
  const onChange = useGet(props.onChange)
  const disable = useVisiblity() === false
  const intersected = useRef(false)

  const measure = useCallback(
    _.debounce((nodeRect?) => {
      const callback = onChange()
      if (!callback) return
      if (nodeRect === false) {
        callback({ visible: false, rect: null })
        return
      }
      const node = ref.current
      if (!node) return
      if (!intersected.current) return
      const visible = disable === false || !isVisible(node)
      const rect =
        !visible || preventMeasure ? undefined : getRect(nodeRect || node.getBoundingClientRect())
      callback({ visible, rect })
    }, debounce),
    [ref, props.preventMeasure, disable],
  )

  useResizeObserver({
    ref,
    onChange: entries => measure(entries[0].contentRect),
    disable,
  })

  useMutationObserver({
    disable,
    ref,
    options: { attributes: true },
    onChange: measure,
  })

  useIntersectionObserver({
    disable,
    ref,
    onChange: entries => {
      if (!entries) return
      const [entry] = entries
      if (entry.isIntersecting) {
        intersected.current = true
        measure(entry.boundingClientRect)
      } else {
        intersected.current = false
        measure(false)
      }
    },
  })

  useEffect(measure, [ref, ...mountArgs])

  useEffect(() => {
    if (disable) {
      measure(false)
    }
  }, [disable])
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
