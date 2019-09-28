import { FullScreen, ViewProps } from '@o/ui'
import React, { useLayoutEffect, useState } from 'react'

import { BrandMark } from '../views/LogoVertical'

const hideProps: ViewProps = {
  opacity: 0,
  pointerEvents: 'none',
}

let hasLoadedOnce = false
setTimeout(() => {
  hasLoadedOnce = true
}, 100)

export function LoadingPage() {
  let [loading, setLoading] = useState(!hasLoadedOnce)

  useLayoutEffect(() => {
    if (hasLoadedOnce) return
    onLoadAllImages().then(() => {
      window['requestIdleCallback'](() => {
        setLoading(false)
        hasLoadedOnce = true
      })
    })
  }, [])

  return (
    <FullScreen
      transition="all ease 300ms"
      opacity={1}
      background={theme => theme.background}
      zIndex={10000000}
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
    let imgs = Array.from(document.images).filter(x => !x.complete)
    let len = imgs.length
    let counter = 0

    if (!len) return res()

    for (const img of imgs) {
      img.addEventListener('load', incrementCounter, false)
    }

    function incrementCounter() {
      counter++
      if (counter === len) {
        res()
      }
    }
  })
}
