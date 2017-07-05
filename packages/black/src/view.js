// @flow
import decor from '@mcro/decor'
import { object, string } from 'prop-types'
import extendsReact from '@mcro/decor/lib/plugins/react/extendsReact'
import type { ExtendsReact } from '@mcro/decor/lib/plugins/react/extendsReact'
import observer from '@mcro/decor/lib/plugins/mobx/observer'
import automagical from '@mcro/decor/lib/plugins/mobx/automagical'
import autobound from '@mcro/decor/lib/plugins/core/autobound'
import helpers from '@mcro/decor/lib/plugins/core/helpers'
import type { Helpers } from '@mcro/decor/lib/plugins/core/helpers'
import subscribable from '@mcro/decor/lib/plugins/react/subscribable'
import type { Subscribable } from '@mcro/decor/lib/plugins/react/subscribable'
import reactRenderArgs from '@mcro/decor/lib/plugins/react/reactRenderArgs'
import type { ReactRenderArgs } from '@mcro/decor/lib/plugins/react/reactRenderArgs'
import addContext from '@mcro/decor/lib/plugins/react/addContext'
import attach from '@mcro/decor/lib/plugins/react/attach'
import storeProvidable from '@mcro/decor/lib/plugins/react/storeProvidable'
import { storeOptions } from './store'
import { createElement, decorator as glossDecorator } from './gloss'
import type { Glossy } from './gloss'

export type ViewClass = ExtendsReact &
  Subscribable &
  Helpers &
  ReactRenderArgs &
  Glossy

export type ViewDec = Function & {
  on(): ViewClass,
  ui(): ViewClass,
  basics(): ViewClass,
  provide(stores: Object): ViewClass,
  attach(...stores: Array<string>): ViewClass,
}

const uiContext = [
  addContext,
  {
    uiTheme: object,
    uiActiveTheme: string,
    ui: object,
  },
]

const catchesErrors = () => ({
  mixin: {
    unstable_handleError(error) {
      console.error(`
        GOT YOU A ERROR THERE ${error.message} ${error.stack}
      `)
      this.setState({ error }) // to work
      if (this.render && !this.render.handlesErrors) {
        const ogRender = this.render.bind(this)
        this.render = function(...args) {
          if (this.state && this.state.errors) {
            return createElement(
              'div',
              { $$fullscreen: true, style: { background: 'red' } },
              JSON.stringify(this.state.errors)
            )
          }
          return ogRender(...args)
        }
        this.render.handlesErrors = true
      }
    },
  },
})

// applied top to bottom
const decorations = ({ mobx, ui, autobind, magic } = {}) => [
  catchesErrors,
  extendsReact,
  subscribable,
  helpers,
  ui && uiContext,
  reactRenderArgs,
  mobx && observer,
  // gloss after mobx
  () => ({ decorator: glossDecorator }),
  magic && automagical,
  // autobind last because it seals things
  autobind && autobound,
  [storeProvidable, storeOptions],
]

const base: () => ViewClass | (() => () => ViewClass) = decor(
  decorations({ mobx: true, autobind: true, magic: true, ui: true })
)

// @view
const view: ViewDec = (item: Object | Class<any> | Function): ViewClass => {
  // @view({ ...stores }) shorthand
  if (typeof item === 'object') {
    return base({ stores: item })
  }
  return base(item)
}

// pass on emitter
view.on = base.on

// other decorators
view.react = decor([extendsReact, reactRenderArgs])
view.ui = decor(decorations({ ui: true, autobind: true }))
view.basics = decor([
  extendsReact,
  reactRenderArgs,
  observer,
  () => ({ decorator: glossDecorator }),
])
view.provide = stores => base({ stores, context: true })
view.attach = (...names) => decor([[attach, { names }]])

export default view
