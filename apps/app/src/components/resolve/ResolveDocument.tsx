// import keywordExtract from 'keyword-extractor'

// const options = {
//   language: 'english',
//   remove_digits: true,
//   return_changed_case: true,
//   remove_duplicates: false,
// }

const replace = {
  'reply to chris': 'Draft Reply to Angela',
}

export const ResolveDocument = ({ bit, children }) =>
  children({
    title: replace[bit.title] || bit.title,
    icon: 'gdocs',
    location: ' ', //bit.data.spaces[0],
    date: Date.now(),
    content: bit.data.markdown,
    preview: replace[bit.title]
      ? 'Hey Angela - hope you\'re doing well - wanted to give an update and ask for advice.\n\nWe are continuing to explore the space of...'
      : bit.body.replace('123', ''),
  })
