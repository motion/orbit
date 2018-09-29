import * as React from 'react'
import keywordExtract from '@mcro/keyword-extract'
import { BitItemResolverProps } from '../ResolveBit'
import { Markdown } from '../../../views/Markdown'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveDocument = ({ bit, children, isExpanded, extraProps }: BitItemResolverProps) =>
  children({
    id: `${bit.id}`,
    type: 'bit',
    title: bit.title,
    icon: bit.integration,
    location: bit.location.name || '',
    locationLink: bit.location.desktopLink || bit.location.webLink,
    webLink: bit.webLink,
    desktopLink: bit.webLink,
    content: isExpanded && !extraProps.minimal ? <Markdown source={bit.body} /> : bit.body,
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 8)
      .join(' '),
  })
