import * as React from 'react'
import { view } from '@mcro/black'
import { CosalSaliency } from './CosalSaliency'
import { CosalSearch } from './CosalSearch'

export const CosalPage = () => {
  return (
    <div
      style={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        pointerEvents: 'auto',
        background: '#fff',
      }}
    >
      <Half>
        <CosalSaliency />
      </Half>
      <Half style={{ flex: 4 }}>
        <CosalSearch />
      </Half>
    </div>
  )
}

const Half = view({
  flex: 1,
  overflow: 'scroll',
})
