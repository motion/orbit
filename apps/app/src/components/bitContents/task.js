import keywordExtract from 'keyword-extractor'
import slackDown from '@mcro/slackdown'
import * as UI from '@mcro/ui'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

const BitGithubTaskComment = ({ comment }) => {
  return <comment>{JSON.stringify(comment)}</comment>
}

const getContents = ({ bit, shownLimit }) => {
  const { comments } = bit.data
  if (comments && comments.length) {
    return comments
      .slice(0, shownLimit)
      .map((comment, index) => (
        <BitGithubTaskComment key={index} comment={comment} bit={bit} />
      ))
  }
  return (
    <UI.Text size={1.2}>
      <div dangerouslySetInnerHTML={{ __html: slackDown(bit.body) }} />
    </UI.Text>
  )
}

export default ({ bit, children, isExpanded, shownLimit }) => {
  const content = isExpanded ? getContents({ bit, shownLimit }) : null
  return children({
    title: bit.title,
    icon: 'github',
    location: `${bit.data.orgLogin}/${bit.data.repositoryName}`,
    date: bit.bitUpdatedAt,
    content,
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 4)
      .join(' '),
  })
}
