import { RefObject, useEffect, useRef, useState } from 'react'

import { useNodeSize, UseNodeSizeProps } from './useNodeSize'

export function useParentNodeSize(props?: UseNodeSizeProps) {
  const ref = useRef<HTMLElement>(null)
  const [parentNode, setParentNode] = useState<RefObject<HTMLElement>>(null)

  const sizer = useNodeSize({
    ref: parentNode,
    ...props,
  })

  useEffect(() => {
    if (!ref.current) return
    let parent = ref.current.parentElement
    // avoid display contents nodes
    while (getComputedStyle(parent, null).display === 'contents') {
      parent = parent.parentElement
    }
    setParentNode({ current: parent })
  }, [ref])

  return {
    ...sizer,
    ref,
  }
}
