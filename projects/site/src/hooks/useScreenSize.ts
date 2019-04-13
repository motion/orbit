import { useMedia } from '@o/ui'
import { useEffect, useState } from 'react'

const widths = {
  small: 680,
  medium: 720,
  large: 1024,
}

type ScreenSize = 'small' | 'medium' | 'large'
let lastSize: ScreenSize = null

export function useScreenSize(): ScreenSize {
  const isSmall = useMedia({ maxWidth: widths.small })
  const isMedium = useMedia({ minWidth: widths.medium })
  const isLarge = useMedia({ minWidth: widths.large })
  const nextSize = isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
  if (lastSize === null) {
    lastSize = nextSize
  }
  const [size, setSize] = useState<ScreenSize>(lastSize)

  useEffect(() => {
    let tm = setTimeout(() => {
      lastSize = nextSize
      setSize(nextSize)
    }, 50)
    return () => clearTimeout(tm)
  }, [nextSize])

  return size
}
