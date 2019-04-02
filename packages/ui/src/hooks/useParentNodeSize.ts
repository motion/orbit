import { RefObject, useEffect, useRef, useState } from 'react'
import { useNodeSize } from './useNodeSize'

export function useParentNodeSize(props?: { disable?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const [parentNode, setParentNode] = useState<RefObject<HTMLElement>>(null)

  const sizer = useNodeSize({
    disable: props && props.disable,
    ref: parentNode,
  })

  useEffect(() => {
    if (!ref.current) return
    let parent = ref.current.parentNode as HTMLElement
    // avoid display contents nodes
    while (getComputedStyle(parent, null).display === 'contents') {
      parent = parent.parentNode as HTMLElement
    }
    setParentNode({ current: parent })
  }, [ref])

  return {
    ...sizer,
    ref,
  }
}
