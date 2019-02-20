import { debounce } from 'lodash'
import { useEffect } from 'react'

export function useScrollPosition<A extends HTMLDivElement, T extends React.RefObject<A>>(
  ref: T,
  cb: (ref: A) => any,
) {
  useEffect(
    () => {
      const node = ref.current
      const scrollParent = getScrollParent(node)
      console.log('scrollParent', scrollParent)
      if (!scrollParent) return
      const onScroll = debounce(() => {
        console.log('got em')
        cb(ref.current)
      }, 32)
      // TODO can make this deduped by container :)
      scrollParent.addEventListener('scroll', onScroll)
      return () => {
        scrollParent.removeEventListener('scroll', onScroll)
      }
    },
    [ref.current],
  )
}

function getScrollParent(element: HTMLElement, includeHidden?: boolean) {
  var style = getComputedStyle(element)
  var excludeStaticParent = style.position === 'absolute'
  var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/

  if (style.position === 'fixed') {
    return window
  }
  for (var parent = element; (parent = parent.parentElement); ) {
    style = getComputedStyle(parent)
    if (excludeStaticParent && style.position === 'static') {
      continue
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent
  }

  return window
}
