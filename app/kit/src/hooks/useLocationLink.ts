import { useCallback } from 'react'

import { config } from '../configureKit'

export function useLocationLink(path: string | false, options = { stopPropagation: false }) {
  if (!path) {
    return null
  }
  return useCallback(
    (e?: any) => {
      if (e && options.stopPropagation) {
        e.stopPropagation()
        e.preventDefault()
      }
      config.handleLink(path)
    },
    [path, options],
  )
}
