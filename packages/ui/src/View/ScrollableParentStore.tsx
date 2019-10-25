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
    measurements: new Map<number, { offset: number; width: number; total: number }>(),
    elements: [] as HTMLElement[],
  }
  setScrollOffset(index: number) {
    const item = this.scrollIntersectionState.measurements.get(index)
    if (item) {
      this.scrollIntersectionState.scrollProgress.set(item.offset)
    }
  }
  startIntersection() {
    this.shouldScrollIntersect = true
  }
}

export const ScrollableParentContext = createStoreContext(ScrollableParentStore)

export const useScrollableParent = () => {
  return ScrollableParentContext.useStore({ react: false })
}

/**
 * Individual helper views for setting up hooks
 */

type ScrollableIntersectionProps = {
  scrollableParent: ScrollableParentStore
  direction: 'x' | 'y'
}

export function ScrollableIntersection(props: ScrollableIntersectionProps) {
  const { direction, scrollableParent } = props
  const scrollProgress = scrollableParent.scrollIntersectionState.scrollProgress
  useScrollProgress({
    direction,
    ref: scrollableParent.props.ref,
    motionValue: scrollProgress,
  })
  useEffect(() => {
    setupScrollableIntersectionEffect(props)
  }, [])
  return null
}

const marginDimensions = {
  width: ['margin-left', 'margin-right'],
  height: ['margin-top', 'margin-bottom'],
}

function setupScrollableIntersectionEffect(props: ScrollableIntersectionProps) {
  const scrollProgress = props.scrollableParent.scrollIntersectionState.scrollProgress
  const ref = props.scrollableParent.props.ref

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
  let updateTm
  function finishUpdate() {
    clearTimeout(updateTm)
    updateTm = setTimeout(() => {
      if (!ref.current) return
      const parentOuterWidth = ref.current[props.direction === 'x' ? 'clientWidth' : 'clientHeight']
      const childrenSizes: { width: number; height: number }[] = []

      for (const [_, { contentRect, node }] of children.entries()) {
        const final = {
          width: contentRect.width,
          height: contentRect.height,
        }

        // now adjust for margins
        const styleMap = node.computedStyleMap()
        for (const dimension in marginDimensions) {
          const sides = marginDimensions[dimension]
          for (const side of sides) {
            const val = styleMap.get(side)
            // @ts-ignore
            if (val.unit === 'percent') {
              // @ts-ignore
              final[dimension] += (val.value * parentOuterWidth) / 100
            } else {
              // @ts-ignore
              final[dimension] += val.to('px').value
            }
          }
        }

        childrenSizes.push(final)
      }

      // calculate real parent width
      const parentSize = childrenSizes.reduce((a, b) => a + b.width, 0)

      // and now update children states
      const offsetKey = props.direction === 'x' ? 'offsetLeft' : 'offsetTop'
      const sizeKey = props.direction === 'x' ? 'width' : 'height'
      for (const [index, { node }] of children.entries()) {
        // now we have the real width, do scroll intersection measurements
        // assume all have same widths for now
        const nodeLeft = node[offsetKey]
        const nodeSize = childrenSizes[index][sizeKey]
        const total = childrenSizes.length
        const width = 1 / total
        const restWidth = parentSize - nodeSize
        const offset = restWidth === 0 ? 0 : nodeLeft / (parentSize - nodeSize)
        props.scrollableParent.scrollIntersectionState.measurements.set(index, {
          offset,
          width,
          total,
        })
      }

      // done, trigger update
      props.scrollableParent.scrollIntersectionState.ready = true
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
    const elements = Array.from(ref.current.childNodes).filter(
      x => x instanceof HTMLElement,
    ) as HTMLElement[]
    props.scrollableParent.scrollIntersectionState.elements = elements
    for (const [index, child] of elements.entries()) {
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
}
