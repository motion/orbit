import React, { useRef, useState } from 'react'
import {
  MergeHighlightsContext,
  MergeHighlightsContextProps,
} from '../helpers/contexts/HighlightsContext'
import { useStores } from '../hooks/useStores'

export function HighlightActiveQuery(props: Partial<MergeHighlightsContextProps>) {
  const activeQuery = useActiveQuery()

  const { appStore } = useStores()

  // initialQuery prevents two renders on mount by just storing the first value of query
  const initialQuery = useRef(null)
  // if (initialQuery.current === null) {
  //   initialQuery.current = appStore.activeQuery
  // }

  const [activeQuery, setActiveQuery] = useState('')

  // keep it in sync
  // useObserver(() => {
  //   if (appStore.activeQuery !== activeQuery) {
  //     setActiveQuery(appStore.activeQuery)
  //   }
  // })

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
