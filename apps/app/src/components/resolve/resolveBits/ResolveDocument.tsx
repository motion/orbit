import markdown from '@mcro/marky-markdown'
import keywordExtract from 'keyword-extractor'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveDocument = ({ bit, searchStore, children, isExpanded }) =>
  children({
    title: bit.title,
    icon: bit.integration || 'gdocs',
    location: 'Wiki',
    permalink: () => searchStore.open(bit),
    date: bit.bitUpdatedAt,
    content: isExpanded
      ? markdown(bit.data.markdownBody || bit.data.body || '')
      : bit.body.slice(0, 200),
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 8)
      .join(' '),
  })
