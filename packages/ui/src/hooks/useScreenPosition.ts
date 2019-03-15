import { debounce } from 'lodash'
import { RefObject, useEffect, useRef } from 'react'
import { useIntersectionObserver } from './useIntersectionObserver'
import { useMutationObserver } from './useMutationObserver'
import { useResizeObserver } from './useResizeObserver'

export type Rect = {
  width: number
  height: number
  top: number
  left: number
}

function getRect(o: any) {
  return { width: o.width, height: o.height, left: o.left, top: o.top }
}

// function useForceUpdate() {
//   const forceUpdate = useState(0)[1]
//   return useCallback(() => forceUpdate(Math.random()), [])
// }

export function useScreenPosition<T extends RefObject<HTMLElement>>(
  ref: T,
  cb: ((rect: Rect | null) => any) | null,
  mountArgs?: any[],
) {
  const intersected = useRef(false)
  const curNode = useRef<HTMLElement | null>(null)

  const measure = () => {
    const node = ref.current
    if (!node || !isVisible(node)) return
    if (!intersected.current) return
    cb(getRect(node.getBoundingClientRect()))
  }

  useResizeObserver(
    curNode,
    debounce(() => {
      console.log('has resized')
    }, 32),
  )

  useMutationObserver(
    curNode,
    { attributes: true, subtree: true, childList: true },
    debounce(() => {}, 32),
  )

  useIntersectionObserver(ref, entries => {
    console.log('wut', entries, ref.current)
    if (!entries) return
    const [entry] = entries
    if (entry.isIntersecting) {
      intersected.current = true
      cb(getRect(entry.boundingClientRect))
    } else {
      intersected.current = false
      cb(null)
    }
  })

  useEffect(measure, [ref.current, ...mountArgs])
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
