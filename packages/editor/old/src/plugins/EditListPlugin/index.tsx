import getCurrentItem from './getCurrentItem'
import getCurrentList from './getCurrentList'
import getItemDepth from './getItemDepth'
import getItemsAtRange from './getItemsAtRange'
import getPreviousItem from './getPreviousItem'
import isList from './isList'
import isSelectionInList from './isSelectionInList'
import makeSchema from './makeSchema'
import onBackspace from './onBackspace'
import onEnter from './onEnter'
import onTab from './onTab'
import Options from './options'
import decreaseItemDepth from './transforms/decreaseItemDepth'
import increaseItemDepth from './transforms/increaseItemDepth'
import splitListItem from './transforms/splitListItem'
import unwrapList from './transforms/unwrapList'
import wrapInList from './transforms/wrapInList'

const KEY_ENTER = 'enter'
const KEY_TAB = 'tab'
const KEY_BACKSPACE = 'backspace'

/**
 * A Slate plugin to handle keyboard events in lists.
 * @param {Options} [opts] Options for the plugin
 * @return {Object}
 */

export function EditListPlugin(opts = {}) {
  opts = new Options(opts)

  /**
   * Bind a transform to be only applied in list
   */
  function bindTransform(fn) {
    return function(transform, ...args) {
      const { state } = transform

      if (!isSelectionInList(opts, state)) {
        return transform
      }

      return fn(...[opts, transform].concat(args))
    }
  }

  /**
   * User is pressing a key in the editor
   */
  function onKeyDown(e, data, state) {
    // Build arguments list
    const args = [e, data, state, opts]

    switch (data.key) {
      case KEY_ENTER:
        return onEnter(...args)
      case KEY_TAB:
        return onTab(...args)
      case KEY_BACKSPACE:
        return onBackspace(...args)
    }
  }

  const schema = makeSchema(opts)

  return {
    onKeyDown,

    schema,

    utils: {
      getCurrentItem: getCurrentItem.bind(null, opts),
      getCurrentList: getCurrentList.bind(null, opts),
      getItemDepth: getItemDepth.bind(null, opts),
      getItemsAtRange: getItemsAtRange.bind(null, opts),
      getPreviousItem: getPreviousItem.bind(null, opts),
      isList: isList.bind(null, opts),
      isSelectionInList: isSelectionInList.bind(null, opts),
    },

    transforms: {
      decreaseItemDepth: bindTransform(decreaseItemDepth),
      increaseItemDepth: bindTransform(increaseItemDepth),
      splitListItem: bindTransform(splitListItem),
      unwrapList: bindTransform(unwrapList),
      wrapInList: wrapInList.bind(null, opts),
    },
  }
}
