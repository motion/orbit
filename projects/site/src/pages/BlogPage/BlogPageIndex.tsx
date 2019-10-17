import { Avatar, SimpleText, Space, Stack, View } from '@o/ui'
import React from 'react'

import { linkProps } from '../../useLink'
import { FadeInView } from '../../views/FadeInView'
import { TitleText } from '../../views/TitleText'
import { BlogLayout } from './BlogLayout'
import { posts } from './posts'

export function BlogPageIndex() {
  const all = Object.keys(posts)
    .slice(0, 10)
    .map(id => ({
      ...posts[id],
      id,
    }))
    .filter(x => !x.private)
    .sort((a, b) => (new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1))

  return (
    <BlogLayout space="md">
      {all.map((post, index) => (
        <FadeInView key={post.date} delay={index * 150}>
          <View
            padding="md"
            {...linkProps(`/blog/${all[index].id}`)}
            hoverStyle={{
              background: [0, 0, 0, 0.05],
            }}
          >
            <TitleText
              fontWeight={400}
              // color={colors.purple}
              selectable={false}
              textAlign="left"
              size="sm"
            >
              {post.title}
            </TitleText>
            <Space size="sm" />
            <PostMeta post={post} />
          </View>
        </FadeInView>
      ))}
    </BlogLayout>
  )
}

export const PostMeta = ({ post }) => {
  return (
    <Stack direction="horizontal" fontWeight={400} alignItems="center" fontSize={15} alpha={0.65}>
      <Avatar size={32} src={post.authorImage} />
      <SimpleText alpha={0.5}>
        &nbsp; &nbsp;
        {post.author}
        &nbsp;&nbsp;&middot;&nbsp;&nbsp;
        {new Date(post.date)
          .toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
          .replace(/,.*,/, ',')
          .replace(/\//g, '·')}{' '}
      </SimpleText>
    </Stack>
  )
}
