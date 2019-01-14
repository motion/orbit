import * as React from 'react'
import CosalSaliency from './CosalSaliency'
import CosalSearch from './CosalSearch'
import { gloss } from '@mcro/gloss'

export default function CosalPage() {
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

const Half = gloss({
  flex: 1,
  overflow: 'scroll',
})
