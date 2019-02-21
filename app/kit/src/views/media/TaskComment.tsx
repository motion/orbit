import { gloss, View } from '@mcro/gloss'
import {
  BorderBottom,
  DateFormat,
  HorizontalSpace,
  Icon,
  RoundButton,
  Row,
  Text,
  VerticalSpace,
  ViewProps,
} from '@mcro/ui'
import * as React from 'react'
import { handleClickPerson } from '../ButtonPerson'
import { Markdown } from './Markdown'

export type TaskCommentLike = {
  author: {
    avatarUrl: string
    login: string
    email: string
  }
  createdAt: string
  body?: string
}

export const TaskComment = ({ author, createdAt, body }: TaskCommentLike) => {
  if (!author) {
    console.warn('error! no author')
    return null
  }
  const { avatarUrl, login, email } = author
  return (
    <HighlightSection>
      <Row alignItems="center">
        <img
          style={{ borderRadius: 100, width: 24, height: 24, marginRight: 10 }}
          src={avatarUrl}
        />
        <RoundButton size={0.9} onClick={handleClickPerson(email)}>
          {login}{' '}
          <Icon
            size={8}
            name="link"
            opacity={0.8}
            marginLeft={2}
            onClick={e => {
              e.stopPropagation()
              // TODO: make generic
              // !TODO
              // AppActions.open(`https://github.com/${login}`)
            }}
          />
        </RoundButton>
        <HorizontalSpace />
        {!!createdAt && (
          <Text size={0.95} fontWeight={600} alpha={0.8}>
            <DateFormat date={new Date(createdAt)} />
          </Text>
        )}
      </Row>
      <VerticalSpace small />
      <Markdown source={body} />
    </HighlightSection>
  )
}

export function HighlightSection({ children, ...props }: ViewProps) {
  return (
    <HighlightSectionChrome {...props}>
      <View margin={-12}>{children}</View>
      <BorderBottom />
    </HighlightSectionChrome>
  )
}

const HighlightSectionChrome = gloss({
  padding: 20,
  overflow: 'hidden',
  position: 'relative',
})
