import React, { useEffect, useState } from 'react'

import { useSiteStore } from '../../SiteStore'

const duration = 4000

export function OuterSpace(props) {
  const siteStore = useSiteStore()
  const [show, setShow] = useState(false)

  useEffect(() => {
    let tm = setTimeout(() => {
      setShow(true)
    }, 1500)
    return () => clearTimeout(tm)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: siteStore.sectionHeight,
        opacity: show ? 0.35 : 0,
        zIndex: -1,
        pointerEvents: 'none',
        transition: `all ease-out ${duration}ms`,
        ...props,
      }}
    >
      {show && (
        <iframe
          title="Animated stars bg"
          style={{ border: 0, height: '100%' }}
          src={process.env.NODE_ENV === 'development' ? '/public/stars.html' : '/stars.html'}
        />
      )}
    </div>
  )
}
