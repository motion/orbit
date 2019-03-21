import { gloss } from '@o/gloss'
import { Inline, ViewProps } from '@o/ui'
import React from 'react'
import { useLocationLink } from '../stores/LocationStore'

export function LocationLink({ url, ...rest }: { url: string } & ViewProps) {
  const link = useLocationLink(url)
  return <LinkChrome onClick={link} {...rest} />
}

const LinkChrome = gloss(Inline).theme((_, theme) => ({
  borderBottom: [1, theme.borderColorActive],
}))
