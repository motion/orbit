import { Block, gloss } from '@o/gloss'
import { ViewProps } from '@o/ui'
import React from 'react'

export function LocationLink({ url, ...rest }: { url: string } & ViewProps) {
  // const link = useLocationLink(url)
  return <LinkChrome onClick={_ => _} {...rest} />
}

const LinkChrome = gloss(Block, {
  display: 'inline',
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColorActive],
}))
