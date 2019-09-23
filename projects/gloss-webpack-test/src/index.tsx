import { View } from '@o/ui/test'
import * as React from 'react'
import { render } from 'react-dom'

function Main() {
  const ref = React.useRef(null)
  const sidebarWidth = 100
  const bg = '#000'
  return (
    <>
      <div>hi</div>
      <View
        nodeRef={ref}
        pointerEvents="auto"
        position="fixed"
        top={0}
        right={0}
        height="100vh"
        background={bg}
        style={{
          width: sidebarWidth,
          transform: `translateX(${sidebarWidth}px)`,
        }}
        className="test"
        color={theme => theme.red}
        onClick={() => {}}
      >
        some children
      </View>
    </>
  )
}

render(<Main />, document.querySelector('#app'))
