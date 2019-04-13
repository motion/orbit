import { useMedia } from '@o/ui'
import { useEffect, useState } from 'react'

const widths = {
  small: 760,
  medium: 800,
  large: 1024,
}

type ScreenSize = 'small' | 'medium' | 'large'
let lastSize: ScreenSize = 'small'

export function useScreenSize(): ScreenSize {
  const isSmall = useMedia({ maxWidth: widths.small })
  const isMedium = useMedia({ minWidth: widths.medium })
  const isLarge = useMedia({ minWidth: widths.large })
  const nextSize = isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
  const [size, setSize] = useState<ScreenSize>(lastSize)

  useEffect(() => {
    let tm = setTimeout(() => {
      lastSize = nextSize
      setSize(nextSize)
    }, 50)
    return () => clearTimeout(tm)
  }, [nextSize])

  console.log('why is media changing', size)

  return size
}
