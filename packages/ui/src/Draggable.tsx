import { createStoreContext } from '@o/use-store'
import { FullScreen, FullScreenProps, gloss } from 'gloss'
import { RefObject, useEffect, useState } from 'react'

class DraggableStore {
  item = null
  position = [0, 0]
  private initialPosition = [0, 0]

  setDragging = (item: any, e: MouseEvent) => {
    this.item = item
    this.initialPosition = [e.clientX, e.clientY]
    this.position = [e.clientX, e.clientY]
    window.addEventListener('mousemove', this.handleDragMove)
    window.addEventListener('mouseup', this.handleDragEnd)
  }

  clearDragging = () => {
    this.item = null
  }

  private handleDragMove = e => {
    console.log('move', e.clientX, e.clientY, this.initialPosition)
    this.initialPosition
    this.position = [e.clientX, e.clientY]
  }

  private handleDragEnd = () => {
    window.removeEventListener('mousemove', this.handleDragMove)
    window.removeEventListener('mouseup', this.handleDragEnd)
  }
}

const Context = createStoreContext(DraggableStore)

export const ProvideDraggable = Context.Provider

export function useCurrentDraggable() {
  const store = Context.useStore()
  return {
    item: store.item,
    position: store.position,
  }
}

type UseDraggableProps = {
  item: any
  ref: RefObject<HTMLElement>
  enabled: boolean
  delay?: number
  onDragStart?: () => any
  onDragEnd?: () => any
}

export function useDraggable({ enabled, item, ref, delay = 800 }: UseDraggableProps) {
  const store = Context.useStore()

  // starts dragging if you hold for `delay` time and dont move mouse
  useEffect(() => {
    const node = ref.current
    if (!node || !enabled) return
    let downTm = null
    const clearDrag = () => {
      clearTimeout(downTm)
    }
    const mouseUp = () => {
      clearDrag()
      window.removeEventListener('mousemove', clearDrag)
    }
    const onMouseDown = e => {
      window.addEventListener('mousemove', clearDrag)
      window.addEventListener('mouseup', mouseUp)
      const event = e.persist()
      downTm = setTimeout(() => {
        console.log('got drag start, do it')
        window.removeEventListener('mousemove', clearDrag)
        window.removeEventListener('mouseup', mouseUp)
        store.setDragging(item, event)
      }, delay)
    }
    node.addEventListener('mousedown', onMouseDown)
    return () => {
      node.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', clearDrag)
      window.removeEventListener('mouseup', mouseUp)
      clearTimeout(downTm)
    }
  }, [enabled, ref, delay])
}

type UseDroppableProps = {
  ref: RefObject<HTMLElement>
  acceptsItem?: (item: any) => boolean
  onDrop?: (item: any) => void
}

export const trueFn = _ => true

export function useDroppable(props: UseDroppableProps): boolean {
  const store = Context.useStore()
  const { ref, acceptsItem = trueFn } = props
  const [isDroppable, setIsDroppable] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const isValid = () => {
      return !!store.item && acceptsItem(store.item) && store.position
    }
    const mouseEnter = () => {
      if (isValid()) {
        setIsDroppable(true)
        node.addEventListener('mouseleave', mouseLeave)
      }
    }
    const mouseLeave = () => {
      setIsDroppable(false)
    }
    node.addEventListener('mouseenter', mouseEnter)
    return () => {
      node.removeEventListener('mouseenter', mouseEnter)
      node.removeEventListener('mouseleave', mouseLeave)
    }
  }, [ref])

  return isDroppable
}

export const DropOverlay = gloss<FullScreenProps & { isDropping?: boolean }>(FullScreen, {
  background: 'transparent',
  isDropping: {
    background: [255, 0, 0, 0.25],
  },
})
