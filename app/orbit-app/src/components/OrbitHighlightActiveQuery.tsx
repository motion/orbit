import { useObserver } from 'mobx-react-lite'
import React, { useRef, useState } from 'react'
import {
  MergeHighlightsContext,
  MergeHighlightsContextProps,
} from '../helpers/contexts/HighlightsContext'
import { useStoresSafe } from '../hooks/useStoresSafe'

export function OrbitHighlightActiveQuery(props: Partial<MergeHighlightsContextProps>) {
  const { appStore } = useStoresSafe()

  // initialQuery prevents two renders on mount by just storing the first value of query
  const initialQuery = useRef(null)
  if (initialQuery.current === null) {
    initialQuery.current = appStore.activeQuery
  }

  const [activeQuery, setActiveQuery] = useState(initialQuery.current)

  // keep it in sync
  useObserver(() => {
    if (appStore.activeQuery !== activeQuery) {
      setActiveQuery(appStore.activeQuery)
    }
  })

  return (
    <MergeHighlightsContext
      value={{
        words: activeQuery.split(' '),
        maxChars: 500,
        maxSurroundChars: 80,
        ...props.value,
      }}
    >
      {props.children}
    </MergeHighlightsContext>
  )
}
