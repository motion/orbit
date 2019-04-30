import { useScreenPosition } from '@o/ui'
import React, { useRef } from 'react'

export let Basic = () => {
  const ref = useRef(null)
  const position = useScreenPosition({
    ref,
  })

  console.log('position', position)

  return <div ref={ref} />
}
