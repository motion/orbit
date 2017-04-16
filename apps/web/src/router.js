import Router from 'motion-mobx-router'
import Home from '$/pages/home'
import Place from '$/pages/place'
import Doc from '$/pages/doc'

export default new Router({
  routes: {
    '/': Home,
    'g/:name': Place,
    'd/:id': Doc,
  },
})
