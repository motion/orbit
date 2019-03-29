import { gloss } from '@o/gloss'

export type PaddedProps = {
  padded?: boolean
}

export const Padded = gloss<PaddedProps>({
  padding: 0,
  padded: {
    padding: 20,
  },
})
