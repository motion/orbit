import { useCallback } from 'react'

import { config } from '../configureKit'

export function useLocationLink(path: string | false) {
  if (!path) {
    return null
  }
  return useCallback(
    (e?: any) => {
      e.stopPropagation()
      e.preventDefault()
      config.handleLink(path)
    },
    [path],
  )
}
