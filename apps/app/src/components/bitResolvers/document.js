// import keywordExtract from 'keyword-extractor'

// const options = {
//   language: 'english',
//   remove_digits: true,
//   return_changed_case: true,
//   remove_duplicates: false,
// }

export default ({ bit, children }) =>
  children({
    title: bit.title,
    icon: 'gdocs',
    location: ' ', //bit.data.spaces[0],
    date: Date.now(),
    content: bit.data.markdown,
    preview: bit.body,
  })
