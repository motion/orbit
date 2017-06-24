// @flow
import decor from '@jot/decor'
import { object, string } from 'prop-types'
import extendsReact, { ExtendsReact } from '@jot/decor/lib/plugins/react/extendsReact'
import observer from '@jot/decor/lib/plugins/mobx/observer'
import autobound from '@jot/decor/lib/plugins/core/autobound'
import subscribableHelpers, { SubscribableHelpers } from '@jot/decor/lib/plugins/core/subscribableHelpers'
import subscribable, { Subscribable } from '@jot/decor/lib/plugins/react/subscribable'
import reactRenderArgs, { ReactRenderArgs } from '@jot/decor/lib/plugins/react/reactRenderArgs'
import addContext from '@jot/decor/lib/plugins/react/addContext'
import attach from '@jot/decor/lib/plugins/react/attach'
import storeProvidable from '@jot/decor/lib/plugins/react/storeProvidable'
import { storeOptions } from './store'
import gloss, { Glossy } from './gloss'

export type ViewClass = ExtendsReact &
  Subscribable &
  SubscribableHelpers &
  ReactRenderArgs &
  Glossy

function getViewDecorator() {
  const uiContext = [
    addContext,
    {
      uiTheme: object,
      uiActiveTheme: string,
      ui: object,
    },
  ]

  // applied top to bottom
  const getPlugins = ({ mobx, ui, autobind } = {}) => [
    extendsReact,
    subscribable,
    subscribableHelpers,
    ui && uiContext,
    reactRenderArgs,
    mobx && observer,
    // gloss after mobx
    options => ({ decorator: gloss }),
    // autobind last because it seals things
    autobind && autobound,
    [storeProvidable, storeOptions],
  ]

  type DecoratorNested = () => ViewClass | (() => () => ViewClass)
  const viewDecorator: DecoratorNested = decor(
    getPlugins({ mobx: true, autobind: true })
  )

  type ViewThing = {
    on(): ViewClass,
    ui(): ViewClass,
    basics(): ViewClass,
    provide(stores: Object): ViewClass,
    attach(...stores: Array<string>): ViewClass,
  }

  const view: ViewThing = (item: Object | Class | Function): ViewClass => {
    // @view({ ...stores }) shorthand
    if (typeof item === 'object') {
      return viewDecorator({ stores: item })
    }
    return viewDecorator(item)
  }

  // pass on emitter
  view.on = viewDecorator.on

  // other decorators
  view.plain = decor(getPlugins())
  view.ui = decor(getPlugins({ ui: true, autobind: true }))
  view.basics = decor([
    extendsReact,
    reactRenderArgs,
    observer,
    opts => ({ decorator: gloss }),
  ])
  view.provide = stores => viewDecorator({ stores, context: true })
  view.attach = names => decor([[attach, { names }]])

  return view
}

export default getViewDecorator()
