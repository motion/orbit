//!
import { ProvideUI, SimpleText, Stack, View } from '@o/ui/test'
import { Box, gloss, Theme } from 'gloss'
import { fromStyles } from 'gloss-theme'
import * as React from 'react'
import { render } from 'react-dom'

export const H2 = props => (
  <View>
    <SimpleText tagName="h2" size="md" {...props} />
  </View>
)

function Main() {
  return (
    <ProvideUI
      themes={{ light: fromStyles({ background: 'white', color: 'black' }) }}
      activeTheme="light"
    >
      <Theme scale={1.5}>
        <View
          background="red"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          alignItems="center"
          justifyContent="center"
        >
          <H2>Test header</H2>
          <SimpleText>Hello world</SimpleText>

          <HeaderContainer>
            <View width={20} height={20} background="blue" />
            <View width={20} height={20} background="blue" />
          </HeaderContainer>

          <Stack direction="horizontal" space>
            <View width={20} height={20} background="blue" />
            <View width={20} height={20} background="blue" />
          </Stack>

          <Stack direction="horizontal">
            <View width={20} height={20} background="blue" />
            <View width={20} height={20} background="blue" />
          </Stack>
        </View>
      </Theme>
    </ProvideUI>
  )
}

const HeaderContainer = gloss(Box, {
  flexDirection: 'row',
  flexShrink: 0,
  left: 0,
  overflow: 'hidden',
  position: 'sticky',
  right: 0,
  textAlign: 'left',
  top: 0,
  zIndex: 2,
  debug: true,
  background: 'red',
}).theme(props => ({
  borderBottom: [1, props.borderColorLight],
}))

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
