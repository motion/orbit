import markdown from '@mcro/marky-markdown'
import keywordExtract from '@mcro/keyword-extract'
import { BitItemResolverProps } from '../ResolveBit'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

const markdownBoldifySearch = (str = '', term = '') => {
  if (term.length < 3) {
    return str
  }
  // avoid highlighting when multiple words for now
  if (term.indexOf(' ') > -1) {
    return str
  }
  return str.replace(new RegExp(`(${term})`, 'gi'), '**$1**')
}

export const ResolveDocument = ({
  bit,
  searchTerm,
  children,
  isExpanded,
}: BitItemResolverProps) =>
  children({
    id: bit.id,
    type: 'bit',
    title: bit.title,
    icon: bit.integration,
    location: bit.location.name || '',
    locationLink: bit.location.desktopLink || bit.location.webLink,
    webLink: bit.webLink,
    desktopLink: bit.webLink,
    content: isExpanded
      ? markdown(markdownBoldifySearch(bit.body, searchTerm))
      : bit.body.slice(0, 200),
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 8)
      .join(' '),
  })
