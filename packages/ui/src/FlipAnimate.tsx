import { useForceUpdate } from '@o/use-store'
import React, { createContext, memo, useContext, useLayoutEffect } from 'react'
import { Flipped, FlippedProps, Flipper } from 'react-flip-toolkit'

const FlipContext = createContext<Function>(null)

export const FlipAnimate = memo((props: { children: any }) => {
  const update = useForceUpdate()
  return (
    <FlipContext.Provider value={update}>
      <Flipper spring="gentle" flipKey={`${Math.random()}`}>
        {props.children}
      </Flipper>
    </FlipContext.Provider>
  )
})

// FlipAnimateItem

type FlipAnimateItemProps = FlippedProps & {
  animateKey?: any
  id: string
  children: React.ReactNode
}

export const FlipAnimateItem = memo(
  ({ animateKey, id, children, ...flippedProps }: FlipAnimateItemProps) => {
    const update = useContext(FlipContext)
    const cleanId = id.replace(/[^a-z0-9]+/gi, '')

    useLayoutEffect(() => {
      update()
    }, [animateKey])

    return (
      <Flipped flipId={cleanId} {...flippedProps}>
        {children}
      </Flipped>
    )
  },
)
