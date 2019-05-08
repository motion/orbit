import { Block, BlockProps, gloss } from '@o/gloss'
import React from 'react'

import { useLocationLink } from '../hooks/useLocationLink'

export function LocationLink({ url, ...rest }: { url: string } & BlockProps) {
  return <LinkChrome {...useLocationLink(url)} {...rest} />
}

const LinkChrome = gloss(Block, {
  display: 'inline',
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColorActive],
}))
