//!
import { themes } from '@o/kit'
import { BorderTop, ProvideUI, View } from '@o/ui/test'
import { gloss } from 'gloss'
import * as React from 'react'
import { render } from 'react-dom'

function Main() {
  const ref = React.useRef(null)
  const sidebarWidth = 100
  const bg = '#000'
  return (
    <ProvideUI themes={themes} activeTheme="light">
      <View sm-marginBottom={20}>
        {/* <Text selectable>hello world</Text>
        <ListItemSimple title="First" icon="ok" />
        <ListItemSimple isSelected title="ok" icon="ok" /> */}
        <BorderTop />
        {/* <Stack direction="horizontal" space="lg">
        <Surface>hello world</Surface>
          <View
            nodeRef={ref}
            pointerEvents="auto"
            position="fixed"
            top={0}
            right={0}
            height="100vh"
            background={bg}
            opacity={bg ? 1 : 0}
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
          <MySimpleView>hihi</MySimpleView>
          <MySubView>hello world</MySubView>
        </Stack> */}
      </View>
    </ProvideUI>
  )
}

const MySimpleView = gloss({
  color: 'yellow',
})

const MySubView = gloss(View, {
  background: 'red',
  color: [255, 255, 255],

  boolProp: {
    color: 'blue',

    '&:hover': {
      color: 'green',
    },
  },

  '@media screen and (max-width: 100px)': {
    background: 'red',
  },
})

render(<Main />, document.querySelector('#app'))
