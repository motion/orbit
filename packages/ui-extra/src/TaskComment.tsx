import { BorderBottom, DateFormat, Icon, RoundButton, Space, Stack, Text, View, ViewProps } from '@o/ui'
import { gloss } from 'gloss'
import * as React from 'react'

import { Markdown } from './Markdown'

export type TaskCommentLike = {
  author: {
    avatarUrl: string
    login: string
  }
  createdAt: string
  body: string
}

export type TaskCommentProps = TaskCommentLike & {
  onClickPerson?: any
}

export function TaskComment({ author, createdAt, body, onClickPerson }: TaskCommentProps) {
  if (!author) {
    console.warn('error! no author')
    return null
  }
  const { avatarUrl, login } = author
  return (
    <HighlightSection>
      <Stack direction="horizontal" alignItems="center">
        <img
          style={{ borderRadius: 100, width: 24, height: 24, marginRight: 10 }}
          src={avatarUrl}
        />
        <RoundButton size={0.9} onClick={onClickPerson}>
          {login} <Icon size={8} name="link" opacity={0.8} marginLeft={2} />
        </RoundButton>
        <Space />
        {!!createdAt && (
          <Text size={0.95} fontWeight={600} alpha={0.8}>
            <DateFormat date={new Date(createdAt)} />
          </Text>
        )}
      </Stack>
      <Space />
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

const HighlightSectionChrome = gloss(View, {
  padding: 20,
  overflow: 'hidden',
  position: 'relative',
})
