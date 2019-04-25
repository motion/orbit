import { Avatar, gloss, Row, View } from '@o/ui'
import React from 'react'
import { useNavigation } from 'react-navi'

import { TitleText } from '../../views/TitleText'
import { purpleWave } from '../HomePage/EarlyAccessBetaSection'
import { BlogLayout } from './BlogLayout'
import { posts } from './posts'

export function BlogPageIndex() {
  const navigation = useNavigation()

  const postIds = Object.keys(posts)
  const recentPosts = Object.keys(posts)
    .slice(0, 10)
    .map(x => posts[x])

  return (
    <BlogLayout space>
      {recentPosts.map((post, index) => (
        <Post
          pad="xl"
          key={index}
          href="what"
          tagName="a"
          textDecoration="none"
          onClick={e => {
            e.preventDefault()
            navigation.navigate(`/blog/${postIds[index]}`)
          }}
          cursor="pointer"
          hoverStyle={{
            background: '#f9f9f9',
          }}
        >
          <TitleText
            fontWeight={200}
            color={purpleWave.backgroundColor}
            selectable={false}
            textAlign="left"
            size="lg"
          >
            {post.title}
          </TitleText>

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
