import { createStoreContext } from '@o/use-store'
import { MotionValue } from 'framer-motion'
import { RefObject, useEffect } from 'react'

import { useScrollProgress } from '../hooks/useScrollProgress'

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
  const scrollProgress = scrollableParent.scrollIntersectionState.scrollProgress
  useScrollProgress({
    ref: scrollableParent.props.ref,
    motionValue: scrollProgress,
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
        const parentOuterWidth = ref.current.clientWidth
        const childrenWidths: { width: number; height: number }[] = []

        for (const [_, { contentRect, node }] of children.entries()) {
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
                final[dimension] += (val.value * parentOuterWidth) / 100
              } else {
                final[dimension] += val.to('px').value
              }
            }
          }

          childrenWidths.push(final)
        }

        // calculate real parent width
        const parentWidth = childrenWidths.reduce((a, b) => a + b.width, 0)

        // and now update children states
        for (const [index, { node }] of children.entries()) {
          // now we have the real width, do scroll intersection measurements
          // assume all have same widths for now
          const nodeLeft = node.offsetLeft
          const nodeWidth = childrenWidths[index].width
          const total = childrenWidths.length
          const width = 1 / total
          const offset = nodeLeft / (parentWidth - nodeWidth)
          scrollableParent.scrollIntersectionState.children.set(node, {
            offset,
            width,
            total,
          })
        }

        // done, trigger update
        scrollProgress.set(scrollProgress.get())
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
          // @ts-ignore
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
