import { useState, useLayoutEffect } from 'react'
import { waitForFonts } from './waitForFonts'

export const useWaitForFonts = (fonts: string[]) => {
  const [loaded, setLoaded] = useState(false)

  useLayoutEffect(() => {
    waitForFonts(fonts, () => {
      console.debug('set fonts loaded', fonts)
      setLoaded(true)
    })
  }, [])

  return loaded
}
