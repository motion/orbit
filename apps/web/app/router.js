// @flow
import Router from 'motion-mobx-router'
import Feed from '~/pages/feed'
import Todo from '~/pages/todo'
import Me from '~/pages/me'
import Place from '~/pages/place'
import Doc from '~/pages/doc'

const AppRouter = new Router({
  routes: {
    '/': Me,
    '/feed': Feed,
    '/todo': Todo,
    'g/:slug(/:hashtag)': Place,
    'd/:id': Doc,
  },
})

export default AppRouter
