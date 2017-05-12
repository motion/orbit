// @flow
import Router from 'motion-mobx-router'
import Feed from '~/pages/feed'
import Todo from '~/pages/todo'
import Home from '~/pages/home'
import Place from '~/pages/place'
import Doc from '~/pages/doc'

const AppRouter = new Router({
  routes: {
    '/': Home,
    '/feed': Feed,
    '/todo': Todo,
    'g/:slug(/:hashtag)': Place,
    'd/:id': Doc,
  },
})

export default AppRouter
