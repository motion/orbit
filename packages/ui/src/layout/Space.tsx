import { gloss } from '@o/gloss'

export const Space = gloss<{ small?: boolean; size?: number }>({
  width: 10,
  height: 10,
  small: {
    width: 6,
    height: 6,
  },
}).theme(({ size }) => ({
  width: size,
  height: size,
}))
