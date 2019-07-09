import { useCurrentDraggable } from '@o/ui'

export const OrbitDraggableOverlay = () => {
  const { item, position } = useCurrentDraggable()
  console.log('render me bitch', item, position)
}
