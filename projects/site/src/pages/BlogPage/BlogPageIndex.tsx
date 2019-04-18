import { gloss, View } from '@o/ui'
import React from 'react'
import { useNavigation } from 'react-navi'
import { TitleText } from '../../views/TitleText'
import { BlogLayout } from './BlogLayout'
import { posts } from './posts'

export function BlogPageIndex() {
  const navigation = useNavigation()

  const postIds = Object.keys(posts)
  const recentPosts = Object.keys(posts)
    .slice(0, 10)
    .map(x => posts[x])

  return (
    <BlogLayout>
      {recentPosts.map((post, index) => (
        <Post
          pad
          key={index}
          href="what"
          tagName="a"
          onClick={e => {
            e.preventDefault()
            navigation.navigate(`/blog/${postIds[index]}`)
          }}
        >
          <TitleText textAlign="left">{post.title}</TitleText>
          {new Date(post.date)
            .toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })
            .replace(/,.*,/, ',')
            .replace(/\//g, '·')}{' '}
          by {post.author}
        </Post>
      ))}
    </BlogLayout>
  )
}

const Post = gloss(View, {})
