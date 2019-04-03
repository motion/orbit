import { gloss } from '@o/gloss'

export type PaddedProps = {
  padded?: boolean
}

export const Padded = gloss<PaddedProps>({
  overflow: 'hidden',
  flex: 1,
  flexFlow: 'inherit',
  padded: {
    padding: 20,
  },
})
