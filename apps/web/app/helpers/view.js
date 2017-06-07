import { view } from '@jot/black'
import glossy from './styles'

// import decor from './decor'
// import extendsReact from './plugins/view/extendsReact'
// import observer from './plugins/mobx/observer'
// import autobound from './plugins/core/autobound'
// import subscribableHelpers from './plugins/core/subscribableHelpers'
// import subscribable from './plugins/react/subscribable'
// import reactRenderArgs from './plugins/react/reactRenderArgs'
// import addContext from './plugins/react/addContext'
// import attach from './plugins/react/attach'
// import { storeProvider } from './store'

// const base = [
//   extendsReact,
//   autobound,
//   subscribable,
//   subscribableHelpers,
//   reactRenderArgs,
// ]

// const mobx = [observer]

// const ui = [
//   [
//     addContext,
//     {
//       uiTheme: object,
//       uiActiveTheme: string,
//       ui: object,
//     },
//   ],
// ]

// const viewBase = decor([...base, ...mobx])

// export default function view(
//   viewOrStores: Object | Class | Function,
//   options = {}
// ) {
//   // @view({ ...stores }) shorthand
//   if (typeof viewOrStores === 'object') {
//     const Stores = viewOrStores
//     return View => {
//       const provider = storeProvider(Stores, options)
//       const view = decorateView(View, options)
//       return provider(view)
//     }
//   }

//   const View = viewOrStores

//   // functional component
//   if (!View.prototype.render) {
//     return glossy(observer(View))
//   }

//   // class
//   return decorateView(viewOrStores, options)
// }

// view.plain = decor(base)
// view.ui = decor([...base, ...ui])
// view.provide = decor([storeDecorator, ...base, ...mobx])
// view.attach = decor([attach])

// // import glossy from './styles'
// // import { storeProvider, attach } from './store'
// // import { string, object } from 'prop-types'

// // function viewDecorator(View, options) {
// //   // extends React.Component

// //   // add Helpers
// //   mixin(View.prototype, ClassHelpers)
// //   mixin(View.prototype, ViewHelpers)
// //   // preact-like render
// //   const or = View.prototype.render
// //   View.prototype.render = function() {
// //     return or.call(this, this.props, this.state, this.context)
// //   }

// //   // @view.simple = avoid mobx
// //   if (options && options.simple) {
// //     return autobind(glossy(View))
// //   }

// //   // order important: autobind, gloss, mobx
// //   const DecoratedView = autobind(glossy(observer(View)))

// //   return DecoratedView
// // }

// //
// // @view
// //

// //
// // view.* helpers
// //

// // view.plain = View => view(View, { simple: true })

// // @view.ui passes themes
// // view.ui = View => {
// //   const next = view(View, { simple: true })
// //   // adds gloss theme context getters
// //   next.contextTypes = {
// //     ...next.contextTypes,
// //     uiTheme: object,
// //     uiActiveTheme: string,
// //     ui: object,
// //   }
// //   return next
// // }

// // @view.provide passes stores down context until @view.attach grabs them
// // view.provide = (Stores, options = {}) => PlainView =>
// //   storeProvider(Stores, { ...options, context: Stores })(
// //     decorateView(PlainView, options)
// //   )

// // @view.attach grabs stores from @view.provide above
