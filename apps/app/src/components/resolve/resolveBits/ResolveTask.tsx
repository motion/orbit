import * as React from 'react'
import keywordExtract from '@mcro/keyword-extract'
import markdown from '@mcro/marky-markdown'
import { TimeAgo } from '../../../views/TimeAgo'
import * as UI from '@mcro/ui'
import { ItemResolverProps } from '../../ItemResolver'

// const converter = new Showdown.Converter()
// const markdown = text => converter.makeHtml(text)

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

const BitGithubTaskComment = ({ comment }) => {
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
        {!!createdAt && <TimeAgo>{createdAt}</TimeAgo>}
      </UI.Row>
      <div
        dangerouslySetInnerHTML={{
          __html: markdown(body),
        }}
      />
    </div>
  )
}

const parseGithubContents = ({ bit, shownLimit }) => {
  let comments
  if (bit.data && bit.data.comments) {
    comments = bit.data.comments
      .slice(0, shownLimit)
      .map((comment, index) => (
        <BitGithubTaskComment key={index} comment={comment} />
      ))
  }
  return {
    content: markdown(bit.data ? bit.data.body : ''),
    comments,
  }
}

export const ResolveTask = ({
  bit,
  children,
  isExpanded,
  shownLimit,
  appStore,
}: ItemResolverProps) => {
  const { content, comments } = isExpanded
    ? parseGithubContents({ bit, shownLimit })
    : { content: null, comments: null }
  return children({
    title: bit.title,
    icon: 'github',
    locationLink: () =>
      appStore.open(
        `https://github.com/${bit.data.orgLogin}/${bit.data.repositoryName}`,
      ),
    location: `${bit.data.orgLogin}/${bit.data.repositoryName}`,
    permalink: () =>
      appStore.open(
        `https://github.com/${bit.data.orgLogin}/${
          bit.data.repositoryName
        }/issues/${bit.data.number}`,
      ),
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
