import { GithubBitData, GithubBitDataComment } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { DateFormat } from '../../../views/DateFormat'
import { BitItemResolverProps } from '../ResolveBit'
import { Markdown } from '../../../views/Markdown'
import { VerticalSpace, HorizontalSpace } from '../../../views'
import { RoundButtonBorderedSmall } from '../../../views/RoundButtonBordered'
import { Text, Icon } from '@mcro/ui'
import { Actions } from '../../../actions/Actions'
import { handleClickPerson } from '../../../views/RoundButtonPerson'

const BitGithubTaskComment = ({ comment }: { comment: GithubBitDataComment }) => {
  const {
    author: { avatarUrl, login, email },
    createdAt,
    body,
  } = comment
  return (
    <React.Fragment>
      <UI.Row alignItems="center">
        <img
          style={{ borderRadius: 100, width: 24, height: 24, marginRight: 10 }}
          src={avatarUrl}
        />
        <RoundButtonBorderedSmall onClick={handleClickPerson(email)}>
          {login}{' '}
          <Icon
            size={8}
            name="link"
            opacity={0.8}
            marginLeft={2}
            onClick={e => {
              e.stopPropagation()
              Actions.open(`https://github.com/${login}`)
            }}
          />
        </RoundButtonBorderedSmall>
        <HorizontalSpace />
        {!!createdAt && (
          <Text size={0.95} fontWeight={600} alpha={0.8}>
            <DateFormat date={new Date(createdAt)} />
          </Text>
        )}
      </UI.Row>
      <VerticalSpace small />
      <Markdown source={body} />
    </React.Fragment>
  )
}

const parseGithubContents = ({ bit, shownLimit }) => {
  let commentComponents
  const { comments, body } = bit.data as GithubBitData
  if (comments) {
    commentComponents = comments
      .slice(0, shownLimit)
      .map((comment, index) => <BitGithubTaskComment key={index} comment={comment} />)
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
  extraProps,
}: BitItemResolverProps) => {
  const { content, comments } =
    isExpanded && !extraProps.minimal
      ? parseGithubContents({ bit, shownLimit })
      : { content: bit.body, comments: null }
  return children({
    id: `${bit.id}`,
    type: 'bit',
    title: bit.title,
    icon: 'github',
    locationLink: bit.location.webLink,
    location: bit.location.name,
    webLink: bit.webLink,
    people: bit.people,
    content,
    comments,
  })
}
