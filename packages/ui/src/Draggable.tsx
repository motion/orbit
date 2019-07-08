import { createStoreContext } from '@o/use-store'

class DraggableStore {
  item = null
  position = [0, 0]
  private initialPosition = [0, 0]

  setDragging = ({ item, position }: { item: any; position: [number, number] }) => {
    this.item = item
    this.initialPosition = position
    this.position = position
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

export function useDraggable() {
  const store = Context.useStore()
  return store
}
