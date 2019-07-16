import { useCallback } from 'react'

import { config } from '../configureKit'

export function useLocationLink(path: string | false) {
  return useCallback(
    (e?: any) => {
      if (!path) {
        return
      }
      e.stopPropagation()
      e.preventDefault()
      config.handleLink!(path)
    },
    [path],
  )
}
