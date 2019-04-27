import { FullScreen } from '@o/ui'
import React, { useEffect, useState } from 'react'

import { BrandMark } from '../views/LogoVertical'

const hideProps = {
  opacity: 0,
}

export function LoadingPage() {
  let [loading, setLoading] = useState(true)

  useEffect(() => {
    onLoadAllImages().then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <FullScreen
      transition="all ease 300ms"
      opacity={1}
      background={theme => theme.background}
      zIndex={Number.MAX_SAFE_INTEGER}
      position="fixed"
      alignItems="center"
      justifyContent="center"
      {...!loading && hideProps}
    >
      <BrandMark id="orbit-mark" />
    </FullScreen>
  )
}

function onLoadAllImages() {
  return new Promise(res => {
    let imgs = Array.from(document.images)
    let len = imgs.length
    let counter = 0

    for (const img of imgs) {
      img.addEventListener('load', incrementCounter, false)
    }

    function incrementCounter() {
      counter++
      console.log('count', counter)
      if (counter === len) {
        res()
      }
    }
  })
}
