// import keywordExtract from 'keyword-extractor'

// const options = {
//   language: 'english',
//   remove_digits: true,
//   return_changed_case: true,
//   remove_duplicates: false,
// }

export const ResolveDocument = ({ bit, children, isExpanded }) =>
  children({
    title: bit.title,
    icon: bit.integration || 'gdocs',
    location: ' ', //bit.data.spaces[0],
    date: Date.now(),
    content: isExpanded
      ? bit.data.markdownBody || bit.data.body || bit.body
      : null,
    preview: bit.body,
  })
