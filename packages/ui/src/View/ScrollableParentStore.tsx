import { createStoreContext } from '@o/use-store'
import { MotionValue } from 'framer-motion'
import { RefObject, useCallback, useEffect, useRef } from 'react'

import { useScrollProgress } from '../hooks/useScrollProgress'
import { ResizeObserver } from '../ResizeObserver'

class ScrollableParentStore {
  props: {
    ref: RefObject<HTMLElement>
  }

  shouldScrollIntersect = false
  scrollIntersectionState = {
    ready: false,
    scrollProgress: new MotionValue(0),
    children: new Map<HTMLElement, { offset: number; width: number; total: number }>(),
  }
  startIntersection() {
    this.shouldScrollIntersect = true
  }
}

export const ScrollableParentContext = createStoreContext(ScrollableParentStore)

export const useScrollableParent = () => {
  return ScrollableParentContext.useStore(undefined, { react: false })
}

/**
 * Individual helper views for setting up hooks
 */

export function ScrollableIntersection({
  scrollableParent,
}: {
  scrollableParent: ScrollableParentStore
}) {
  useScrollProgress({
    ref: scrollableParent.props.ref,
    motionValue: scrollableParent.scrollIntersectionState.scrollProgress,
  })

  useEffect(() => {
    const ref = scrollableParent.props.ref

    const disposables = new Set<{
      type: string
      dispose: Function
    }>()

    const children = new Map<
      number,
      {
        contentRect: DOMRectReadOnly
        node: HTMLElement
      }
    >()

    /**
     * Collect children ResizeObserver updates for next update
     */
    function updateChild(index: number, contentRect: DOMRectReadOnly, node: HTMLElement) {
      children.set(index, { contentRect, node })
      finishUpdate()
    }

    /**
     * Run finishUpdate after all children update, so we avoid reflows
     */
    const marginDimensions = {
      width: ['margin-left', 'margin-right'],
      height: ['margin-top', 'margin-bottom'],
    }
    let updateTm
    function finishUpdate() {
      clearTimeout(updateTm)
      updateTm = setTimeout(() => {
        console.log('now update children measurements')
        const parentWidth = ref.current.clientWidth
        children.forEach(({ contentRect, node }) => {
          const final = {
            width: contentRect.width,
            height: contentRect.height,
          }

          // now adjust for margins
          // @ts-ignore
          const styleMap = node.computedStyleMap()
          for (const dimension in marginDimensions) {
            const sides = marginDimensions[dimension]
            for (const side of sides) {
              const val = styleMap.get(side)
              if (val.unit === 'percent') {
                final[dimension] += (val.value * parentWidth) / 100
              } else {
                final[dimension] += val.to('px').value
              }
            }
          }

          console.log('value', final)
        })
      }, 0)
    }

    function watchChildren() {
      disposables.forEach(x => {
        if (x.type === 'child') {
          x.dispose()
        }
      })
      children.clear()
      // add resizeObservers to all children
      for (const [index, child] of Array.from(ref.current.childNodes).entries()) {
        if (child instanceof HTMLElement) {
          const resizer = new ResizeObserver(entries => {
            if (entries.length) {
              updateChild(index, entries[0].contentRect, child)
            }
          })
          resizer.observe(child)
          disposables.add({
            type: 'child',
            dispose: () => resizer.disconnect(),
          })
        }
      }
    }

    const measureChildrenObserver = new MutationObserver(watchChildren)
    measureChildrenObserver.observe(ref.current, {
      childList: true,
    })
    disposables.add({
      type: 'parent',
      dispose: () => measureChildrenObserver.disconnect(),
    })
    watchChildren()

    return () => {
      disposables.forEach(x => x.dispose())
    }
  }, [])

  return null
}

// const measure = () => {
//   // if (!this.nodeRef.current || !ref.current) {
//   //   throw new Error(`No node or parent node (did you give a parent scrollable=""?)`)
//   // }
//   // if (!ref.current.scrollWidth) {
//   //   return
//   // }
//   // const nodeWidth = this.nodeRef.current.clientWidth
//   // const nodeLeft = this.nodeRef.current.offsetLeft
//   // if (nodeLeft < 0) {
//   //   // this happens on mount sometimes but will be fixed once measured
//   //   return
//   // }
//   // const parentWidth = ref.current.scrollWidth
//   // // assume all have same widths for now
//   // const total = ref.current.childElementCount
//   // const width = 1 / total
//   // const offset = nodeLeft / (parentWidth - nodeWidth)

//   // const next = { width, offset, total }
//   // if (!isEqual(state.current, next)) {
//   //   state.current = next
//   //   // TODO called too much... scrollWidth isn't great
//   //   // trigger update
//   //   scrollProgress.set(scrollProgress.get())
//   // }
// }
