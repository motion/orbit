import { createStoreContext } from '@o/use-store'
import { RefObject, useEffect, useRef, useState } from 'react'

class DraggableStore {
  item = null
  position = [0, 0]
  private initialPosition = [0, 0]

  setDragging = (item: any, e: MouseEvent<any>) => {
    this.item = item
    this.initialPosition = e.clientX
    this.position = e.clientY
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

export function useCurrentDraggingItem() {
  return Context.useStore().item
}

type UseDraggableProps = {
  item: any
  ref: RefObject<HTMLElement>
  delay?: number
  onDragStart?: () => any
  onDragEnd?: () => any
}

export function useDraggable({ item, ref, delay = 1000 }: UseDraggableProps) {
  const node = ref.current
  const store = Context.useStore()

  // starts dragging if you hold for `delay` time and dont move mouse
  useEffect(() => {
    if (!node) return
    let downTm = null
    const clearDrag = () => {
      clearTimeout(downTm)
    }
    const onMouseDown = e => {
      window.addEventListener('mousemove', clearDrag)
      window.addEventListener('mouseup', clearDrag)
      const event = e.persist()
      downTm = setTimeout(() => {
        window.removeEventListener('mousemove', clearDrag)
        window.removeEventListener('mouseup', clearDrag)
        store.setDragging(item, event)
      }, delay)
    }
    node.addEventListener('mousedown', onMouseDown)
    return () => {
      node.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', clearDrag)
      window.removeEventListener('mouseup', clearDrag)
      clearTimeout(downTm)
    }
  }, [node, delay])
}

type UseDroppableProps = {
  ref: RefObject<HTMLElement>
  acceptsItem?: (item: any) => boolean
}

const trueFn = _ => true

export function useDroppable(props: UseDroppableProps): boolean {
  const store = Context.useStore()
  const { ref, acceptsItem = trueFn } = props
  const node = ref.current
  const [isDroppable, setIsDroppable] = useState(false)

  useEffect(() => {
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
  }, [node])

  return isDroppable
}
