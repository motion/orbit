//!
import { themes } from '@o/kit'
import { ProvideUI, SimpleText } from '@o/ui/test'
import * as React from 'react'
import { render } from 'react-dom'

function Main() {
  const ref = React.useRef(null)
  const sidebarWidth = 100
  const bg = '#000'
  return (
    <ProvideUI themes={themes} activeTheme="light">
      <SimpleText color="red">Hello world</SimpleText>
      {/* <View sm-marginBottom={20}>
        <HeaderContainer /> */}
      {/* <BorderTop /> */}
      {/* <Text selectable>hello world</Text>
        <ListItemSimple title="First" icon="ok" />
        <ListItemSimple isSelected title="ok" icon="ok" /> */}
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
      {/* </View> */}
    </ProvideUI>
  )
}

// const HeaderContainer = gloss(Box, {
//   flexDirection: 'row',
//   flexShrink: 0,
//   left: 0,
//   overflow: 'hidden',
//   position: 'sticky',
//   right: 0,
//   textAlign: 'left',
//   top: 0,
//   zIndex: 2,
//   debug: true,
//   background: 'red',
// }).theme(props => ({
//   borderBottom: [1, props.borderColorLight],
// }))

// const MySimpleView = gloss({
//   color: 'yellow',
// })

// const MySubView = gloss(View, {
//   background: 'red',
//   color: [255, 255, 255],

//   boolProp: {
//     color: 'blue',

//     hoverStyle: {
//       color: 'green',
//     },
//   },

//   '@media screen and (max-width: 100px)': {
//     background: 'red',
//   },
// })

render(<Main />, document.querySelector('#app'))
