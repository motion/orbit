import * as React from 'react'
import { Saliency } from './Saliency'
import { Search } from './Search'

export const CosalDebug = () => {
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
}

const Half = gloss({
  flex: 1,
  overflow: 'scroll',
})
