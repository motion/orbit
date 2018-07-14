import * as React from 'react'
import keywordExtract from 'keyword-extractor'
import markdown from '@mcro/marky-markdown'
import { TimeAgo } from '../../views/TimeAgo'
import { RoundButton } from '../../views/RoundButton'
import * as UI from '@mcro/ui'

// const converter = new Showdown.Converter()
// const markdown = text => converter.makeHtml(text)

const options = {
  language: 'english',
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
          css={{ borderRadius: 100, width: 24, height: 24, marginRight: 10 }}
          src={avatarUrl}
        />
        {login}
        <TimeAgo if={createdAt}>{createdAt}</TimeAgo>
      </UI.Row>
      <body
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
        <BitGithubTaskComment key={index} comment={comment} bit={bit} />
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
}) => {
  const { content, comments } = isExpanded
    ? parseGithubContents({ bit, shownLimit })
    : { content: null, comments: null }
  return children({
    title: bit.title,
    icon: 'github',
    location: (
      <RoundButton
        onClick={e => {
          e.stopPropagation()
          // TODO: resolve links on all bits in one place
          appStore.open(
            `https://github.com/${bit.data.orgLogin}/${
              bit.data.repositoryName
            }`,
          )
        }}
      >
        {bit.data.orgLogin}/{bit.data.repositoryName}
      </RoundButton>
    ),
    permalink: () =>
      appStore.open(
        `https://github.com/${bit.data.orgLogin}/${
          bit.data.repositoryName
        }/issues/${bit.data.number}`,
      ),
    people: bit.people,
    date: bit.bitUpdatedAt,
    content,
    comments,
    preview:
      keywordExtract
        .extract(bit.body, options)
        .slice(0, 4)
        .join(' ') || bit.body.slice(0, 400),
  })
}
