import { RefObject, useEffect, useRef, useState } from 'react'
import { useNodeSize } from './useNodeSize'

export function useParentNodeSize() {
  const ref = useRef<HTMLElement>(null)
  const [parentNode, setParentNode] = useState<RefObject<HTMLElement>>(null)
  const sizer = useNodeSize({
    ref: parentNode,
  })

  useEffect(
    () => {
      if (!ref.current) return
      setParentNode({ current: ref.current.parentNode as HTMLElement })
    },
    [ref],
  )

  return {
    ...sizer,
    ref,
  }
}
