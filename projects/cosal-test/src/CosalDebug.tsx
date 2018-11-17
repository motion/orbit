import * as React from 'react'
import { Search } from './Search'
import { Saliency } from './Saliency'
import { view } from '@mcro/black'

export const CosalDebug = ({ store }) => {
  return (
    <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Half>
        <Saliency />
      </Half>
      <Half>
        <Search />
      </Half>
    </div>
  )
}

const Half = view({
  height: '50%',
  flex: 1,
  overflow: 'scroll',
})
