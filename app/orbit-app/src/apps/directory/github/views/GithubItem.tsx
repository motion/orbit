import * as React from 'react'
import { GithubBitDataComment, GithubBitData } from '@mcro/models'
import { RoundButtonBorderedSmall } from '../../../../views/RoundButtonBordered'
import { handleClickPerson } from '../../../../views/RoundButtonPerson'
import { Row, Icon, Text } from '@mcro/ui'
import { Actions } from '../../../../actions/Actions'
import { HorizontalSpace, VerticalSpace } from '../../../../views'
import { DateFormat } from '../../../../views/DateFormat'
import { Markdown } from '../../../../views/Markdown'
import { OrbitAppProps } from '../../../types'

const BitGithubTaskComment = ({ comment }: { comment: GithubBitDataComment }) => {
  const {
    author: { avatarUrl, login, email },
    createdAt,
    body,
  } = comment
  return (
    <React.Fragment>
      <Row alignItems="center">
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
      </Row>
      <VerticalSpace small />
      <Markdown source={body} />
    </React.Fragment>
  )
}

const parseGithubContents = ({ bit, shownLimit }) => {
  if (!bit) {
    console.log('no bit', bit)
    return {}
  }
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

export class GithubItem extends React.Component<OrbitAppProps<'github'>> {
  render() {
    const { bit, shownLimit } = this.props
    const { content, comments } = parseGithubContents({ bit, shownLimit })
    return (
      <>
        {content}
        {comments}
      </>
    )
  }
}
