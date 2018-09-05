import keywordExtract from '@mcro/keyword-extract'
import { GithubBitData, GithubBitDataComment } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { DateFormat } from '../../../views/DateFormat'
import { BitItemResolverProps } from '../ResolveBit'
import { Markdown } from '../../../views/Markdown'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

const BitGithubTaskComment = ({
  comment,
}: {
  comment: GithubBitDataComment
}) => {
  const {
    author: { avatarUrl, login },
    createdAt,
    body,
  } = comment
  return (
    <div>
      <UI.Row>
        <img
          style={{ borderRadius: 100, width: 24, height: 24, marginRight: 10 }}
          src={avatarUrl}
        />
        {login}
        {!!createdAt && <DateFormat date={new Date(createdAt)} />}
      </UI.Row>
      <Markdown source={body} />
    </div>
  )
}

const parseGithubContents = ({ bit, shownLimit }) => {
  let commentComponents
  const { comments, body } = bit.data as GithubBitData
  if (comments) {
    commentComponents = comments
      .slice(0, shownLimit)
      .map((comment, index) => (
        <BitGithubTaskComment key={index} comment={comment} />
      ))
  }
  return {
    content: <Markdown source={body} />,
    comments: commentComponents,
  }
}

export const ResolveTask = ({
  bit,
  children,
  isExpanded,
  shownLimit,
}: BitItemResolverProps) => {
  const { content, comments } = isExpanded
    ? parseGithubContents({ bit, shownLimit })
    : { content: null, comments: null }
  return children({
    id: bit.id,
    type: 'bit',
    title: bit.title,
    icon: 'github',
    locationLink: bit.location.webLink,
    location: bit.location.name,
    webLink: bit.webLink,
    people: bit.people,
    content,
    comments,
    preview:
      keywordExtract
        .extract(bit.body, options)
        .slice(0, 4)
        .join(' ') || bit.body.slice(0, 400),
  })
}
