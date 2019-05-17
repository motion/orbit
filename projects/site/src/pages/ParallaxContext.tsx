import { createContextualProps } from '@o/ui'

import { Parallax } from '../views/Parallax'

export const ParallaxContext = createContextualProps<{
  value: Parallax
}>({ value: null })

export const useParallax = () => {
  try {
    return ParallaxContext.useProps().value
  } catch {
    return null
  }
}
