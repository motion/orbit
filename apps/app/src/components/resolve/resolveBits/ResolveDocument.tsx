import markdown from '@mcro/marky-markdown'
import keywordExtract from 'keyword-extractor'

const options = {
  language: 'english',
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
  appStore,
  searchTerm,
  children,
  isExpanded,
}) =>
  children({
    title: bit.title,
    icon: bit.integration || 'gdocs',
    location: 'Wiki',
    permalink: () => appStore.open(bit),
    date: bit.bitUpdatedAt,
    content: isExpanded
      ? markdown(
          markdownBoldifySearch(
            bit.data.markdownBody || bit.data.body || bit.body || '',
            searchTerm,
          ),
        )
      : bit.body.slice(0, 200),
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 8)
      .join(' '),
  })
