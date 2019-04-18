import { compose, mount, route, withView } from 'navi'
import React from 'react'
import { View } from 'react-navi'
import { Header } from '../views/Header'
import { MDX } from '../views/MDX'

const posts = {
  'update-one': () => import('./BlogPage/update-one/index.md'),
}

export default compose(
  withView(() => {
    return (
      <BlogPage>
        <View />
      </BlogPage>
    )
  }),

  mount({
    '/': route({
      title: 'Docs',
      view: null,
    }),
    '/:id': route(async req => {
      let id = req.params.id
      let ChildView = (await posts[id]()).default || (() => <div>nada {id}</div>)
      console.log('ChildView', ChildView)
      return {
        view: <ChildView />,
      }
    }),
  }),
)

function BlogPage(props: { title?: string; children?: any }) {
  return (
    <MDX>
      <Header slim />
      {props.children}
    </MDX>
  )
}

BlogPage.theme = 'light'
