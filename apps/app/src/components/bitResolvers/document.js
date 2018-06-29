// import keywordExtract from 'keyword-extractor'

// const options = {
//   language: 'english',
//   remove_digits: true,
//   return_changed_case: true,
//   remove_duplicates: false,
// }

const replace = {
  'reply to chris': 'Reply to Jeff',
}

export default ({ bit, children }) =>
  children({
    title: replace[bit.title] || bit.title,
    icon: 'gdocs',
    location: ' ', //bit.data.spaces[0],
    date: Date.now(),
    content: bit.data.markdown,
    preview: replace[bit.title]
      ? 'Hey Jeff - hope you\'re doing well - wanted to give an update and ask for advice.\n\nWe are continuing to explore the space of...'
      : bit.body.replace('123', ''),
  })
