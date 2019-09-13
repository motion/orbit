import { createStoreContext } from '@o/use-store'
import { FullScreen, FullScreenProps, gloss } from 'gloss'
import { RefObject, useEffect, useState } from 'react'

type OnDropCb = (item?: any, position?: [number, number]) => void

class DraggableStore {
  item = null
  position = [0, 0]
  activeDropCb: OnDropCb | null = null
  private initialPosition = [0, 0]

  setDragging = (item: any, e: MouseEvent) => {
    ActiveDraggables.cancelAll()
    this.item = item
    this.initialPosition = [e.clientX, e.clientY]
    this.position = [e.clientX, e.clientY]
    window.addEventListener('mousemove', this.handleDragMove)
    window.addEventListener('mouseup', this.handleDragEnd)
  }

  clearDragging = () => {
    this.item = null
    this.activeDropCb = null
  }

  setActiveDrop = (cb: OnDropCb) => {
    this.activeDropCb = cb
  }

  private handleDragMove = e => {
    console.log('move', e.clientX, e.clientY, this.initialPosition)
    this.initialPosition
    this.position = [e.clientX, e.clientY]
  }

  private handleDragEnd = () => {
    window.removeEventListener('mousemove', this.handleDragMove)
    window.removeEventListener('mouseup', this.handleDragEnd)
    if (this.activeDropCb) {
      this.activeDropCb(this.item)
    }
    this.clearDragging()
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
  onDragStart?: (...args: any[]) => any
  onDragEnd?: () => any
}

export function useDraggable({ enabled, item, ref, delay = 800, onDragStart }: UseDraggableProps) {
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
      downTm = setTimeout(() => {
        window.removeEventListener('mousemove', clearDrag)
        window.removeEventListener('mouseup', mouseUp)
        store.setDragging(item, e)
        onDragStart && onDragStart(e, item)
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
  onDrop?: OnDropCb
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
        store.setActiveDrop(props.onDrop)
        node.addEventListener('mouseleave', mouseLeave)
      }
    }
    const mouseLeave = () => {
      if (store.activeDropCb === props.onDrop) {
        store.setActiveDrop(null)
      }
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

export const ActiveDraggables = {
  items: new Set<Function>(),
  add(item: Function) {
    this.items.add(item)
  },
  remove(item: Function) {
    this.items.delete(item)
  },
  cancelAll() {
    for (const cancel of this.items) {
      cancel()
    }
  },
}
