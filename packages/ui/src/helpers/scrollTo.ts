import { createUpdateableSpring } from './createUpdateableSpring'
import { elementOffset } from './elementOffset'

export const scrollTo = (query: string) => {
  const spring = createUpdateableSpring(document.documentElement.scrollTop, {
    damping: 50,
    stiffness: 250,
  })
  const { top } = elementOffset(document.querySelector(query))

  spring.value.onChange(val => {
    document.documentElement.scrollTop = val
  })

  spring.value.set(top)
}
