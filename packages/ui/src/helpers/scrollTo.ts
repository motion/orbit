import { createUpdateableSpring } from './createUpdateableSpring'
import { elementOffset } from './elementOffset'

export const scrollTo = (queryOrOffset: string | number) => {
  const spring = createUpdateableSpring(document.documentElement.scrollTop, {
    damping: 50,
    stiffness: 250,
  })
  let top = 0
  if (typeof queryOrOffset === 'string') {
    top = elementOffset(document.querySelector(queryOrOffset)).top
  } else {
    top = queryOrOffset
  }

  spring.value.onChange(val => {
    document.documentElement.scrollTop = val
  })

  spring.value.set(top)
}
