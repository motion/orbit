import { Popover } from '@o/ui'
import * as React from 'react'

import { MENU_WIDTH } from '../../constants'
import { useMenuStore } from './MenuStore'

const springyConfig = {
  mass: 0.8,
  tension: 280,
  friction: 22,
  velocity: 20,
}
const noAnimationConfig = { duration: 1 }

export function MenuChrome(props: { children: any }) {
  const menuStore = useMenuStore()
  const { menuCenter, menuHeight, openState } = menuStore

  React.useEffect(() => {
    menuStore.onDidRender(open)
  })

  const pad = menuStore.menuPad
  const left = menuCenter - MENU_WIDTH / 2
  const { open, repositioning } = openState
  const config = repositioning ? noAnimationConfig : springyConfig
  // const { x, y, opacity } = useSpring({
  //   x: left,
  //   y: open ? 0 : -5,
  //   opacity: open ? 1 : 0,
  //   config,
  // })

  return (
    <>
      <div
        ref={menuStore.menuRef}
        style={{
          height: window.innerHeight,
          position: 'absolute',
          zIndex: 100000,
          borderRadius: 12,
          top: pad,
          // transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          // opacity,
          width: MENU_WIDTH,
          pointerEvents: 'all',
        }}
      >
        {props.children}
      </div>
      <div
        style={{
          position: 'absolute',
          // transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
          // opacity,
        }}
      >
        <Popover
          noPortal
          open
          background
          width={MENU_WIDTH + pad * 2}
          height={menuHeight + 11 /* arrow size, for now */}
          towards="bottom"
          delay={0}
          top={0}
          left={0}
          distance={pad}
          forgiveness={pad}
          edgePadding={0}
          elevation={20}
          themeName="dark"
        />
      </div>
    </>
  )
}
