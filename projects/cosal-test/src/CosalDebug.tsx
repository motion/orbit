import * as React from 'react'
import { Search } from './Search'
import { Saliency } from './Saliency'
import { view } from '@mcro/black'

export const CosalDebug = () => {
  return (
    <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Half>
        <Saliency />
      </Half>
      <Half style={{ flex: 2 }}>
        <Search />
      </Half>
    </div>
  )
}

const Half = view({
  flex: 1,
  overflow: 'scroll',
})
