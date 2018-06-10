import keywordExtract from 'keyword-extractor'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

const BitGithubTaskComment = ({ comment }) => {
  return <comment>{JSON.stringify(comment)}</comment>
}

export default ({ bit, children, isExpanded, shownLimit }) => {
  const content = isExpanded
    ? (bit.data.comments || [])
        .slice(0, shownLimit)
        .map((comment, index) => (
          <BitGithubTaskComment key={index} comment={comment} bit={bit} />
        ))
    : null
  return children({
    title: bit.title,
    icon: 'github',
    location: ' ', //bit.data.spaces[0],
    date: bit.bitUpdatedAt,
    content,
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 4)
      .join(' '),
  })
}
