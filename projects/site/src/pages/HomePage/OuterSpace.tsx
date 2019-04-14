import React, { useEffect, useState } from 'react'

export function OuterSpace(props) {
  const [didMount, setDidMount] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setDidMount(true)
    }, 100)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: didMount ? 0.5 : 0,
        transition: 'all  ease 2500ms',
        ...props,
      }}
    >
      <iframe style={{ border: 0, height: '100%' }} src="/public/stars.html" />
    </div>
  )
}
