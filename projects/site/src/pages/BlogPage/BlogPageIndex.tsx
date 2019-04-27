import { Avatar, gloss, Row, Space, View } from '@o/ui'
import React from 'react'
import { useNavigation } from 'react-navi'

import { colors } from '../../constants'
import { TitleText } from '../../views/TitleText'
import { BlogLayout } from './BlogLayout'
import { posts } from './posts'

export function BlogPageIndex() {
  const navigation = useNavigation()

  const all = Object.keys(posts)
    .slice(0, 10)
    .map(id => ({
      ...posts[id],
      id,
    }))
    .sort((a, b) => (new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1))

  return (
    <BlogLayout space>
      {all.map((post, index) => (
        <Post
          pad="xl"
          key={post.date}
          tagName="a"
          {...{ href: `/blog/${all[index].id}` }}
          textDecoration="none"
          onClick={e => {
            e.preventDefault()
            navigation.navigate(`/blog/${all[index].id}`)
          }}
          cursor="pointer"
          hoverStyle={{
            background: '#f9f9f9',
          }}
        >
          <TitleText
            fontWeight={200}
            color={colors.purple}
            selectable={false}
            textAlign="left"
            size="lg"
          >
            {post.title}
          </TitleText>
          <Space size="sm" />
          <PostMeta post={post} />
        </Post>
      ))}
    </BlogLayout>
  )
}

export const PostMeta = ({ post }) => {
  return (
    <Row alignItems="center" fontSize={16} alpha={0.65}>
      <Avatar size={16} src={post.authorImage} />
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
    </Row>
  )
}

const Post = gloss(View, {})
