import { createContextualProps } from '@o/ui'

export const HeaderContext = createContextualProps<{
  setShown?: Function
  shown?: boolean
}>()
