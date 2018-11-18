import * as React from 'react'
import { Search } from './Search'
import { Saliency } from './Saliency'
import { view } from '@mcro/black'

export const CosalDebug = __evaluatePureFunction(() => {
  return (
    <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Half>
        <Saliency />
      </Half>
      <Half style={{ flex: 4 }}>
        <Search />
      </Half>
    </div>
  )
})

// prepack
if (global.__optimizeReactComponentTree) {
  __optimizeReactComponentTree(CosalDebug)
}

const Half = view({
  flex: 1,
  overflow: 'scroll',
})
