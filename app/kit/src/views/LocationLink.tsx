import { Block, gloss } from '@o/gloss'
import { ViewProps } from '@o/ui'
import React from 'react'
import { useLocationLink } from '../hooks/useLocationLink';

export function LocationLink({ url, ...rest }: { url: string } & ViewProps) {
  const props = useLocationLink(url)
  return <LinkChrome {...props} {...rest} />
}

const LinkChrome = gloss(Block, {
  display: 'inline',
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColorActive],
}))
