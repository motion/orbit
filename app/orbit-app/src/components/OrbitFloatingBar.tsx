import { gloss } from '@mcro/gloss'
import { Absolute, Row, Theme } from '@mcro/ui'
import React, { useState } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { HorizontalSpace } from '../views'
import { FloatingBarButtonLarge } from '../views/FloatingBar/FloatingBarButtonLarge'

export default function OrbitFloatingBar(props: { showSearch?: boolean; children?: any }) {
  const { searchStore } = useStoresSafe()
  const [isShown, setIsShown] = useState(true)
  const [barHeight, setBarHeight] = useState(300)
  const topBarHeight = 60

  return (
    <Absolute
      bottom={0}
      left={0}
      right={0}
      height={barHeight}
      zIndex={100000}
      transition="transform ease 200ms"
      transform={{
        y: isShown ? 0 : barHeight - topBarHeight,
      }}
      {...props}
    >
      <Row height={topBarHeight} padding={16} alignItems="center">
        {!!props.children && (
          <>
            {props.children}
            <HorizontalSpace />
          </>
        )}

        <Theme name={isShown ? 'selected' : null}>
          <FloatingBarButtonLarge
            icon="orbitSearch"
            onClick={() => {
              setIsShown(!isShown)
            }}
          />
        </Theme>
      </Row>

      <FloatingBarContent />
    </Absolute>
  )
}

const FloatingBarContent = gloss({
  flex: 1,
  padding: 16,
}).theme((_, theme) => ({
  background: theme.background,
  boxShadow: [[0, 0, 10, [0, 0, 0, 0.05]]],
}))
