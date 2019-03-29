import { gloss } from '@o/gloss'

export type PaddedProps = {
  padded?: boolean
}

export const Padded = gloss<PaddedProps>({
  flex: 1,
  flexFlow: 'inherit',
  padded: {
    padding: 20,
  },
})
