import { useEffect, useRef } from 'react'

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

export function useOnNodeVisible(
  ref: React.RefObject<HTMLDivElement>,
  onVisibilityChange: (isVisible: boolean) => any,
) {
  const node = ref.current
  const visible = useRef(false)

  useEffect(
    () => {
      if (!node) return
      const observer = new MutationObserver(() => {
        const next = isVisible(node)
        console.log('NEXY', next)
        if (next !== visible.current) {
          visible.current = next
          onVisibilityChange(next)
        }
      })

      observer.observe(node, { attributes: true })

      return () => {
        observer.disconnect()
      }
    },
    [node],
  )
}
