import { config } from '../configureKit'

export function useLocationLink(path: string | false, stopPropagation = false) {
  if (!path) {
    return null
  }
  return {
    onClick: (e?: React.MouseEvent<any, any> | MouseEvent) => {
      if (e && stopPropagation) {
        e.stopPropagation()
        e.preventDefault()
      }
      config.handleLink(path)
    },
  }
}
