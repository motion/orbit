import { useEffect, useState } from 'react'
import { waitForFonts } from './waitForFonts'

export const useWaitForFonts = (fonts: string[]) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    waitForFonts(fonts, () => {
      setLoaded(true)
    })
  }, [])

  return loaded
}
